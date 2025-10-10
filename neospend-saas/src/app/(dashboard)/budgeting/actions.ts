// src/app/(dashboard)/budgeting/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ✅ Next (async cookies): erst auflösen, dann Methoden durchreichen
async function supabaseServer() {
    const cookieStore = await cookies(); // <- wichtig
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options?: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options?: any) {
                    cookieStore.set({ name, value: "", ...options, maxAge: 0 });
                },
            },
        }
    );
}

const REVALIDATE_PATH = "/(dashboard)/budgeting";

/** Neues Budget (pro Kategorie-Name) anlegen oder updaten (falls doppelt) */
export async function createBudgetAction(input: {
    categoryName: string | null;  // NULL = global monthly budget
    limitAmount: number;
    month: number;                // 1..12
    year: number;                 // YYYY
}) {
    const supabase = await supabaseServer(); // <- wichtig

    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    // Prüfen, ob Eintrag existiert
    const base = supabase
        .from("budgets")
        .select("id")
        .eq("year", input.year)
        .eq("month", input.month);

    const { data: existing, error: selErr } =
        input.categoryName === null
            ? await base.is("category", null).maybeSingle()
            : await base.eq("category", input.categoryName).maybeSingle();

    if (selErr && selErr.code !== "PGRST116") throw selErr; // "not found" ignorieren

    if (existing) {
        const { error } = await supabase
            .from("budgets")
            .update({ limit: input.limitAmount })
            .eq("id", existing.id);
        if (error) throw error;
    } else {
        const { error } = await supabase.from("budgets").insert({
            user_id: authUser.user.id,
            category: input.categoryName, // text | null
            limit: input.limitAmount,
            month: input.month,
            year: input.year,
        });
        if (error) throw error;
    }

    revalidatePath(REVALIDATE_PATH);
}

export async function updateBudgetAction(input: { id: string; limitAmount: number }) {
    const supabase = await supabaseServer(); // <- wichtig

    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("budgets")
        .update({ limit: input.limitAmount })
        .eq("id", input.id);

    if (error) throw error;
    revalidatePath(REVALIDATE_PATH);
}

export async function deleteBudgetAction(input: { id: string }) {
    const supabase = await supabaseServer(); // <- wichtig

    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) throw new Error("Not authenticated");

    const { error } = await supabase.from("budgets").delete().eq("id", input.id);
    if (error) throw error;

    revalidatePath(REVALIDATE_PATH);
}

/** Upsert für das globale Monatsbudget (category = NULL) */
export async function upsertMonthlyBudgetAction(input: {
    limitAmount: number;
    month: number;
    year: number;
}) {
    return createBudgetAction({
        categoryName: null,
        limitAmount: input.limitAmount,
        month: input.month,
        year: input.year,
    });
}
