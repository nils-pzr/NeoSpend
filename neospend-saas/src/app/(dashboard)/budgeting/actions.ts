"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* ===========================================================
   🔐 SUPABASE CLIENT
   =========================================================== */
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
            },
        },
    );
}

const REVALIDATE_PATH = "/(dashboard)/budgeting";

/* ===========================================================
   🧩 CRUD FUNKTIONEN
   =========================================================== */

export async function createBudgetAction(input: {
    categoryName: string | null;
    limitAmount: number;
    month: number;
    year: number;
}) {
    const supabase = await supabaseServer();
    const {
        data: { user },
        error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) throw new Error("Not authenticated");

    // ✅ Schutz gegen NaN / undefined
    const validLimit =
        typeof input.limitAmount === "number" && !isNaN(input.limitAmount)
            ? input.limitAmount
            : 0;

    // 🔹 Upsert mit constraint user_id+month+year+category
    const { error } = await supabase.from("budgets").upsert(
        {
            user_id: user.id,
            category: input.categoryName,
            limit: validLimit,
            month: input.month,
            year: input.year,
        },
        { onConflict: "user_id,month,year,category" },
    );

    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE_PATH);
}

export async function updateBudgetAction(input: {
    id: string;
    limitAmount: number;
}) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const validLimit =
        typeof input.limitAmount === "number" && !isNaN(input.limitAmount)
            ? input.limitAmount
            : 0;

    const { error } = await supabase
        .from("budgets")
        .update({ limit: validLimit })
        .eq("id", input.id)
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE_PATH);
}

export async function deleteBudgetAction(input: { id: string }) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", input.id)
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    revalidatePath(REVALIDATE_PATH);
}

/* ===========================================================
   ⚙️ EINSTELLUNGEN
   =========================================================== */

export async function getBudgetSettings() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data } = await supabase
        .from("budgeting_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    return data ?? {};
}

export async function updateCarryOverSetting(enabled: boolean) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
        .from("budgeting_settings")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existing) {
        await supabase
            .from("budgeting_settings")
            .update({
                carry_over_enabled: enabled,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);
    } else {
        await supabase.from("budgeting_settings").insert({
            user_id: user.id,
            carry_over_enabled: enabled,
        });
    }

    revalidatePath(REVALIDATE_PATH);
}

export async function updateAutoAllocateSetting(enabled: boolean) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    await supabase
        .from("budgeting_settings")
        .update({
            auto_allocate_enabled: enabled,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    revalidatePath(REVALIDATE_PATH);
}

export async function updateAutoAllocateMode(mode: "even" | "percentage") {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    await supabase
        .from("budgeting_settings")
        .update({
            auto_allocate_mode: mode,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
}

export async function updateResetRuleSetting(rule: "zero" | "keep" | "average") {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    await supabase
        .from("budgeting_settings")
        .update({
            reset_rule: rule,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
}

/* ===========================================================
   🔁 AUTOMATISCHE SYSTEMFUNKTIONEN
   =========================================================== */

export async function applyCarryOver() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const userId = user.id;
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const { data: settings } = await supabase
        .from("budgeting_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (!settings?.carry_over_enabled) return;

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

        await supabase.from("budgets").upsert(
            {
                user_id: userId,
                category: b.category,
                limit: remaining,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            },
            { onConflict: "user_id,month,year,category" },
        );
    }

    await supabase
        .from("budgeting_settings")
        .update({ last_carryover_applied_at: new Date().toISOString() })
        .eq("user_id", userId);
}

export async function applyAutoAllocate() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const userId = user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const { data: settings } = await supabase
        .from("budgeting_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (!settings?.auto_allocate_enabled) return;

    const mode = settings.auto_allocate_mode ?? "even";

    const { data: incomeTx } = await supabase
        .from("transactions")
        .select("amount, date, type")
        .eq("user_id", userId)
        .eq("type", "income");

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const totalIncome = (incomeTx ?? [])
        .filter((tx) => {
            const d = new Date(tx.date);
            return d >= start && d <= end;
        })
        .reduce((sum, tx) => sum + Number(tx.amount ?? 0), 0);

    if (totalIncome <= 0) return;

    const { data: budgets } = await supabase
        .from("budgets")
        .select("id, limit, category")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month);

    if (!budgets?.length) return;

    if (mode === "even") {
        const share = totalIncome / budgets.length;
        for (const b of budgets) {
            await supabase.from("budgets").update({ limit: share }).eq("id", b.id);
        }
    }

    if (mode === "percentage") {
        const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit ?? 0), 0);
        for (const b of budgets) {
            const weight = totalLimit
                ? Number(b.limit ?? 0) / totalLimit
                : 1 / budgets.length;
            const newLimit = totalIncome * weight;
            await supabase.from("budgets").update({ limit: newLimit }).eq("id", b.id);
        }
    }

    await supabase
        .from("budgeting_settings")
        .update({ last_auto_allocate_at: new Date().toISOString() })
        .eq("user_id", userId);
}

export async function applyResetRules() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const userId = user.id;
    const now = new Date();

    const { data: settings } = await supabase
        .from("budgeting_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    const rule = settings?.reset_rule ?? "keep";

    const { data: currentBudgets } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .eq("year", now.getFullYear())
        .eq("month", now.getMonth() + 1);

    if (!currentBudgets?.length) return;

    if (rule === "zero") {
        for (const b of currentBudgets) {
            await supabase.from("budgets").update({ limit: 0 }).eq("id", b.id);
        }
    } else if (rule === "average") {
        const avg =
            currentBudgets.reduce((a, b) => a + Number(b.limit ?? 0), 0) /
            currentBudgets.length;
        for (const b of currentBudgets) {
            await supabase.from("budgets").update({ limit: avg }).eq("id", b.id);
        }
    }

    await supabase
        .from("budgeting_settings")
        .update({ last_reset_rules_applied_at: new Date().toISOString() })
        .eq("user_id", userId);
}

export async function runMonthlyMaintenance() {
    try {
        await applyCarryOver();
        await applyAutoAllocate();
        await applyResetRules();
    } catch (err) {
        console.error("⚠️ Monthly maintenance error:", err);
    }
}

export async function getLastMaintenanceInfo() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("budgeting_settings")
        .select(
            "last_carryover_applied_at, last_auto_allocate_at, last_reset_rules_applied_at",
        )
        .eq("user_id", user.id)
        .maybeSingle();

    return data ?? null;
}
