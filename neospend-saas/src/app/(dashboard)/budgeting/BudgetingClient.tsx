"use client";

import React from "react";
import MonthlyOverview from "./components/MonthlyOverview";
import BudgetCard from "./components/BudgetCard";
import CreateBudget from "./components/CreateBudget";
import { getCurrentMonthKey } from "./utils";
import {
    createBudgetAction,
    updateBudgetAction,
    deleteBudgetAction,
} from "./actions";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

// ⚠️ Wir benutzen TEXT-basierte Kategorienamen
type Transaction = {
    id: string;
    categoryName: string | null; // TEXT aus DB
    amount: number;
    type: "expense" | "income";
    date: string;
};

type BudgetRow = { id: number; category: string | null; limit: number };

export default function BudgetingClient({
                                            categories,
                                            transactions,
                                            budgets,
                                        }: {
    categories: Category[];
    transactions: Transaction[];
    budgets: BudgetRow[];
}) {
    const router = useRouter();
    const mKey = getCurrentMonthKey();
    const month = Number(String(mKey).slice(4, 6));
    const year = Number(String(mKey).slice(0, 4));

    // --- State (optimistic) ---
    const [budgetsState, setBudgetsState] = React.useState<BudgetRow[]>(budgets);

    // Globales Monatsbudget (category=null)
    const monthlyBudget = React.useMemo(
        () => budgetsState.find((b) => b.category === null) ?? null,
        [budgetsState],
    );

    // Ausgaben pro Kategorie
    const spentByCategory = React.useMemo(() => {
        const map = new Map<string, number>();
        transactions.forEach((t) => {
            if (t.type !== "expense" || !t.categoryName) return;
            map.set(t.categoryName, (map.get(t.categoryName) ?? 0) + Math.abs(t.amount));
        });
        return map;
    }, [transactions]);

    // Kategorie-Budgets (ohne globales)
    const categoryBudgets = React.useMemo(
        () => budgetsState.filter((b) => b.category !== null) as BudgetRow[],
        [budgetsState],
    );

    // Karten-Daten
    const budgetCards = React.useMemo(() => {
        return categoryBudgets.map((b) => {
            const catName = String(b.category);
            const spent = spentByCategory.get(catName) ?? 0;
            return {
                id: String(b.id),
                categoryName: catName,
                limit: b.limit,
                spent,
            };
        });
    }, [categoryBudgets, spentByCategory]);

    // Totals
    const totals = React.useMemo(() => {
        const spent = Array.from(spentByCategory.values()).reduce((s, v) => s + v, 0);
        const limit =
            monthlyBudget?.limit ??
            categoryBudgets.reduce((s, b) => s + (Number(b.limit) || 0), 0);
        const remaining = Math.max(0, limit - spent);
        const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
        return { limit, spent, remaining, pct };
    }, [spentByCategory, monthlyBudget, categoryBudgets]);

    // ===== Mutations (Server Actions) =====
    async function updateCategoryBudgetLimit(id: number, limit: number) {
        const snapshot = budgetsState;
        setBudgetsState((prev) =>
            prev.map((b) => (b.id === id ? { ...b, limit } : b)),
        );
        try {
            await updateBudgetAction({ id: String(id), limitAmount: limit });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            console.error(e);
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
            console.error(e);
        }
    }

    async function createCategoryBudget(payload: { categoryName: string; limit: number }) {
        const snapshot = budgetsState;
        const tempId = Math.random();
        setBudgetsState((prev) => [
            ...prev,
            { id: tempId, category: payload.categoryName, limit: payload.limit },
        ]);
        try {
            await createBudgetAction({
                categoryName: payload.categoryName,
                limitAmount: payload.limit,
                month,
                year,
            });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            console.error(e);
        }
    }

    async function updateMonthlyBudgetLimit(limit: number) {
        const snapshot = budgetsState;
        const hasGlobal = budgetsState.find((b) => b.category === null);
        if (hasGlobal) {
            setBudgetsState((prev) =>
                prev.map((b) => (b.category === null ? { ...b, limit } : b)),
            );
        } else {
            setBudgetsState((prev) => [...prev, { id: Math.random(), category: null, limit }]);
        }
        try {
            await createBudgetAction({
                categoryName: null,
                limitAmount: limit,
                month,
                year,
            });
            router.refresh();
        } catch (e) {
            setBudgetsState(snapshot);
            console.error(e);
        }
    }

    // Gesperrte Kategorien (bereits Budget)
    const blockedCategoryNames = React.useMemo(
        () => categoryBudgets.map((b) => String(b.category!)),
        [categoryBudgets],
    );

    // === Render ===
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
                    onCreate={createCategoryBudget}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetCards.map((b) => (
                    <BudgetCard
                        key={b.id}
                        budget={{
                            id: Number(b.id),
                            category: b.categoryName ?? null,
                            limit: b.limit,
                            spent: b.spent,
                        }}
                        onUpdateLimit={updateCategoryBudgetLimit}
                        onRemove={removeCategoryBudget}
                    />
                ))}
            </div>
        </div>
    );
}
