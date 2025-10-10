// src/app/(dashboard)/budgeting/page.tsx
import React from "react";
import Header from "./components/Header";
import BudgetingClient from "./BudgetingClient";
import { getCurrentMonthRange, getCurrentMonthKey } from "./utils";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const metadata = { title: "Budgeting | NeoSpend" };

export default async function Page() {
    const { start, end } = getCurrentMonthRange();
    const mKey = getCurrentMonthKey();
    const month = Number(String(mKey).slice(4, 6));
    const year = Number(String(mKey).slice(0, 4));

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }); },
                remove(name: string, options?: any) { cookieStore.set({ name, value: "", ...options, maxAge: 0 }); },
            },
        }
    );

    // Kategorien
    const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

    const categories =
        (categoriesData ?? []).map((c: any) => ({
            id: String(c.id),
            name: String(c.name),
        })) as { id: string; name: string }[];

    // ⚠️ Transaktionen: 'category' (TEXT), nicht 'category_id'
    // Außerdem ist 'date' ein DATE; daher auf YYYY-MM-DD normalisieren.
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const { data: txData } = await supabase
        .from("transactions")
        .select("id, category, amount, type, date")
        .gte("date", startStr)
        .lte("date", endStr);

    const transactions =
        (txData ?? []).map((t: any) => ({
            id: String(t.id),
            categoryName: t.category === null ? null : String(t.category), // <- TEXT
            amount: Number(t.amount),
            type: (t.type ?? "expense") as "expense" | "income",
            date: String(t.date),
        })) as {
            id: string;
            categoryName: string | null;
            amount: number;
            type: "expense" | "income";
            date: string;
        }[];

    // Budgets (year/month) – category ist ebenfalls TEXT|NULL
    const { data: budgetsData } = await supabase
        .from("budgets")
        .select("id, category, limit, month, year")
        .eq("year", year)
        .eq("month", month);

    const budgets =
        (budgetsData ?? []).map((b: any) => ({
            id: Number(b.id),
            category: b.category === null ? null : String(b.category),
            limit: Number(b.limit),
        })) as { id: number; category: string | null; limit: number }[];

    return (
        <div className="container max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <Header />
            <BudgetingClient categories={categories} transactions={transactions} budgets={budgets} />
        </div>
    );
}
