// src/app/(dashboard)/budgeting/BudgetingClient.tsx
"use client";

import React from "react";
import MonthlyOverview from "./components/MonthlyOverview";
import BudgetCard from "./components/BudgetCard";
import CreateBudget from "./components/CreateBudget";
import { getCurrentMonthKey } from "./utils";
import { createBudgetAction, updateBudgetAction, deleteBudgetAction, upsertMonthlyBudgetAction } from "./actions";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type Transaction = { id: string; categoryName: string | null; amount: number; type: "expense" | "income" | string; date: string };
type BudgetRow = { id: number; category: string | null; limit: number };

const norm = (s: string) => s.toLowerCase().trim();

export default function BudgetingClient({
                                            categories,
                                            transactions,
                                            budgets,
                                        }: {
    categories: Category[];
    transactions: Transaction[];  // ⚠️ jetzt mit categoryName
    budgets: BudgetRow[];         // category = TEXT | NULL
}) {
    const router = useRouter();
    const monthKey = getCurrentMonthKey();
    const month = Number(String(monthKey).slice(4, 6));
    const year = Number(String(monthKey).slice(0, 4));

    // Optimistischer State, damit neue Budgets sofort erscheinen
    const [budgetsState, setBudgetsState] = React.useState<BudgetRow[]>(budgets);

    // Ausgaben je **normalisiertem Kategorienamen**
    const spentByName = React.useMemo(() => {
        const m = new Map<string, number>();
        transactions.forEach((t) => {
            const isExpense =
                (typeof t.type === "string" && t.type.toLowerCase() === "expense") || t.amount < 0;
            if (!isExpense) return;
            if (!t.categoryName) return;
            const key = norm(t.categoryName);
            m.set(key, (m.get(key) ?? 0) + Math.abs(t.amount));
        });
        return m;
    }, [transactions]);

    const monthlyBudget = React.useMemo(
        () => budgetsState.find((b) => b.category === null) ?? null,
        [budgetsState]
    );

    const categoryBudgets = React.useMemo(
        () => budgetsState.filter((b) => b.category !== null) as BudgetRow[],
        [budgetsState]
    );

    const budgetCards = React.useMemo(() => {
        return categoryBudgets.map((b) => {
            const catName = String(b.category);
            const spent = spentByName.get(norm(catName)) ?? 0;
            return { id: b.id, category: catName, limit: b.limit, spent };
        });
    }, [categoryBudgets, spentByName]);

    const totals = React.useMemo(() => {
        const spent = budgetCards.reduce((s, c) => s + c.spent, 0);
        const sumOfCategoryBudgets = categoryBudgets.reduce((s, b) => s + b.limit, 0);
        const limit = monthlyBudget?.limit ?? sumOfCategoryBudgets;
        return { limit, spent };
    }, [budgetCards, monthlyBudget, categoryBudgets]);

    // Mutations
    async function updateCategoryBudgetLimit(id: number, limit: number) {
        const snapshot = budgetsState;
        setBudgetsState((prev) => prev.map((b) => (b.id === id ? { ...b, limit } : b)));
        try {
            await updateBudgetAction({ id: String(id), limitAmount: limit });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            throw e;
        }
    }

    async function removeCategoryBudget(id: number) {
        const snapshot = budgetsState;
        setBudgetsState((prev) => prev.filter((b) => b.id !== id));
        try {
            await deleteBudgetAction({ id: String(id) });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            throw e;
        }
    }

    async function createCategoryBudget(payload: { categoryName: string; limit: number }) {
        const tempId = -Date.now();
        setBudgetsState((prev) => [{ id: tempId, category: payload.categoryName, limit: payload.limit }, ...prev]);
        try {
            await createBudgetAction({ categoryName: payload.categoryName, limitAmount: payload.limit, month, year });
            router.refresh();
        } catch (e) {
            setBudgetsState((prev) => prev.filter((b) => b.id !== tempId));
            throw e;
        }
    }

    async function updateMonthlyBudgetLimit(limit: number) {
        const snapshot = budgetsState;
        setBudgetsState((prev) => {
            const existing = prev.find((b) => b.category === null);
            if (existing) return prev.map((b) => (b.category === null ? { ...b, limit } : b));
            return [{ id: -1, category: null, limit }, ...prev];
        });
        try {
            await upsertMonthlyBudgetAction({ limitAmount: limit, month, year });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            throw e;
        }
    }

    const blockedCategoryNames = React.useMemo(
        () => categoryBudgets.map((b) => String(b.category!)),
        [categoryBudgets]
    );

    return (
        <div className="space-y-6">
            <MonthlyOverview
                totals={totals}
                monthlyBudgetLimit={monthlyBudget?.limit ?? null}
                onUpdateMonthlyBudgetLimit={updateMonthlyBudgetLimit}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Budgets per category</h2>
                <CreateBudget
                    categories={categories}
                    blockedCategoryNames={blockedCategoryNames}
                    onCreate={({ categoryName, limit }) => createCategoryBudget({ categoryName, limit })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetCards.map((b) => (
                    <BudgetCard
                        key={b.id}
                        budget={b}
                        onUpdateLimit={updateCategoryBudgetLimit}
                        onRemove={removeCategoryBudget}
                    />
                ))}
            </div>
        </div>
    );
}
