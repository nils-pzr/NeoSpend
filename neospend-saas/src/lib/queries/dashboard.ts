// lib/queries/dashboard.ts
import { supabase } from "../supabaseClient";

export async function getDashboardData(userId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // === Transactions ===
    const { data: tx, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

    if (txError) throw txError;

    const income = tx
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expenses = tx
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? (income - expenses) / income : 0;

    const recentTx = tx.slice(0, 5);

    // === Budgets ===
    const { data: budgets, error: bErr } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .eq("year", year);

    if (bErr) throw bErr;

    return {
        balance,
        income,
        expenses,
        savingsRate,
        recentTx,
        budgets,
    };
}
