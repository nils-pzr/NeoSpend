"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * ✅ Universelle, typ-sichere Supabase-Client-Funktion
 *  → funktioniert mit Next 15 und @supabase/ssr >= 0.5
 */
async function supabaseServer() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: "", ...options, maxAge: 0 });
                },
            },
        }
    );
}

const REVALIDATE_PATH = "/(dashboard)/budgeting";

/** 🧩 Monatsbudget erstellen oder updaten */
export async function createBudgetAction(input: {
    categoryName: string | null;
    limitAmount: number;
    month: number;
    year: number;
}) {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    // Prüfen, ob Eintrag existiert
    const base = supabase
        .from("budgets")
        .select("id")
        .eq("year", input.year)
        .eq("month", input.month)
        .eq("user_id", authUser.user.id);

    const { data: existing, error: selErr } =
        input.categoryName === null
            ? await base.is("category", null).maybeSingle()
            : await base.eq("category", input.categoryName).maybeSingle();

    if (selErr && selErr.code !== "PGRST116") throw selErr;

    if (existing) {
        const { error } = await supabase
            .from("budgets")
            .update({ limit: input.limitAmount })
            .eq("id", existing.id);
        if (error) throw error;
    } else {
        const { error } = await supabase.from("budgets").insert({
            user_id: authUser.user.id,
            category: input.categoryName,
            limit: input.limitAmount,
            month: input.month,
            year: input.year,
        });
        if (error) throw error;
    }

    revalidatePath(REVALIDATE_PATH);
}

/** 🧩 Budgetlimit ändern */
export async function updateBudgetAction(input: {
    id: string;
    limitAmount: number;
}) {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("budgets")
        .update({ limit: input.limitAmount })
        .eq("id", input.id);
    if (error) throw error;

    revalidatePath(REVALIDATE_PATH);
}

/** 🗑️ Budget löschen */
export async function deleteBudgetAction(input: { id: string }) {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { error } = await supabase.from("budgets").delete().eq("id", input.id);
    if (error) throw error;

    revalidatePath(REVALIDATE_PATH);
}

/** ⚙️ Einstellungen abrufen */
export async function getBudgetSettings() {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { data } = await supabase
        .from("budgeting_settings")
        .select("carry_over_enabled, last_carryover_applied_yyyymm")
        .eq("user_id", authUser.user.id)
        .maybeSingle();

    return data ?? { carry_over_enabled: false };
}

/** ⚙️ Carry-Over-Einstellung aktualisieren */
export async function updateCarryOverSetting(enabled: boolean) {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
        .from("budgeting_settings")
        .select("user_id")
        .eq("user_id", authUser.user.id)
        .maybeSingle();

    if (existing) {
        await supabase
            .from("budgeting_settings")
            .update({
                carry_over_enabled: enabled,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", authUser.user.id);
    } else {
        await supabase.from("budgeting_settings").insert({
            user_id: authUser.user.id,
            carry_over_enabled: enabled,
        });
    }

    revalidatePath(REVALIDATE_PATH);
}

/** 🔁 Carry-Over-Logik ausführen */
export async function applyCarryOver() {
    const supabase = await supabaseServer();
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const userId = authUser.user.id;

    // Aktuelle Einstellungen
    const { data: settings } = await supabase
        .from("budgeting_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (!settings?.carry_over_enabled) return; // deaktiviert

    const now = new Date();
    const currentYYYYMM = Number(
        `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`
    );

    if (settings.last_carryover_applied_yyyymm === currentYYYYMM) return; // schon angewendet

    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    // Alte Budgets holen
    const { data: oldBudgets } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .eq("year", lastYear)
        .eq("month", lastMonth);

    if (!oldBudgets?.length) return;

    for (const b of oldBudgets) {
        const remaining = Math.max(0, (b.limit ?? 0) - (b.spent ?? 0));
        if (remaining <= 0) continue;

        // Prüfe, ob Budget im aktuellen Monat existiert
        const { data: existing } = await supabase
            .from("budgets")
            .select("id, limit")
            .eq("user_id", userId)
            .eq("year", now.getFullYear())
            .eq("month", now.getMonth() + 1)
            .eq("category", b.category)
            .maybeSingle();

        if (existing) {
            await supabase
                .from("budgets")
                .update({ limit: existing.limit + remaining })
                .eq("id", existing.id);
        } else {
            await supabase.from("budgets").insert({
                user_id: userId,
                category: b.category,
                limit: remaining,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            });
        }
    }

    // Markiere als angewendet
    await supabase
        .from("budgeting_settings")
        .update({ last_carryover_applied_yyyymm: currentYYYYMM })
        .eq("user_id", userId);

    revalidatePath(REVALIDATE_PATH);
}
