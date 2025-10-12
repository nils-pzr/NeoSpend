// src/app/(dashboard)/budgeting/page.tsx
import React from "react";
import Header from "./components/Header";
import BudgetingClient from "./components/BudgetingClient";
import { getCurrentMonthRange, getCurrentMonthKey } from "./utils";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { initializeBudgetingSystem } from "./initBudgeting";

export const metadata = { title: "Budgeting | NeoSpend" };

export default async function Page() {
    // ⚙️ Initialisierung nur am Monatsanfang (z. B. 1. Tag im Monat)
    const today = new Date();
    if (today.getDate() === 1) {
        try {
            await initializeBudgetingSystem();
        } catch (err) {
            console.error("⚠️ Budget init skipped or failed:", err);
        }
    }

    const { start, end } = getCurrentMonthRange();
    const mKey = getCurrentMonthKey();
    const month = Number(String(mKey).slice(4, 6));
    const year = Number(String(mKey).slice(0, 4));

    // 🧩 Supabase-Client
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    // 🧠 Hole eingeloggten User
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const userId = user.id;

    // 🔹 Kategorien laden (mit Farbe)
    const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name, color")
        .order("name", { ascending: true });

    const categories =
        (categoriesData ?? []).map((c: any) => ({
            id: String(c.id),
            name: String(c.name),
            color: c.color ? String(c.color) : undefined,
        })) ?? [];

    // 🔹 Transaktionen des Monats (nur für den User)
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const { data: txData } = await supabase
        .from("transactions")
        .select("id, category, amount, type, date")
        .eq("user_id", userId)
        .gte("date", startStr)
        .lte("date", endStr);

    const transactions =
        (txData ?? []).map((t: any) => ({
            id: String(t.id),
            categoryName: t.category === null ? null : String(t.category),
            amount: Number(t.amount),
            type: (t.type ?? "expense") as "expense" | "income",
            date: String(t.date),
        })) ?? [];

    // 🔹 Budgets des Monats (nur für den User)
    const { data: budgetsData } = await supabase
        .from("budgets")
        .select("id, category, limit, month, year")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month);

    const budgets =
        (budgetsData ?? []).map((b: any) => ({
            id: Number(b.id),
            category: b.category === null ? null : String(b.category),
            limit: Number(b.limit),
        })) ?? [];

    return (
        <div className="container max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <Header />
            <BudgetingClient
                categories={categories}
                transactions={transactions}
                budgets={budgets}
            />
        </div>
    );
}
