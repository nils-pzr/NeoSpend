"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Budget {
    id: number;
    user_id: string;
    category: string | null;
    limit: number;
}

interface Transaction {
    id: number;
    user_id: string;
    category: string | null;
    type: "income" | "expense";
    amount: number;
}

export default function BudgetOverview() {
    const [budgets, setBudgets] = useState<(Budget & { spent: number })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudgets = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return setLoading(false);

            // 1️⃣ Budgets abrufen
            const { data: budgetsData, error: bErr } = await supabase
                .from("budgets")
                .select("*")
                .eq("user_id", user.id);

            // 2️⃣ Transaktionen abrufen
            const { data: txData, error: tErr } = await supabase
                .from("transactions")
                .select("amount, category, type, user_id")
                .eq("user_id", user.id);

            if (bErr || tErr) {
                console.error("Fehler beim Laden:", bErr || tErr);
                setLoading(false);
                return;
            }

            // 3️⃣ Spent dynamisch berechnen (inkl. Monthly Budget)
            const budgetsWithSpent = (budgetsData || []).map((b) => {
                const categoryName =
                    b.category && b.category.trim() !== ""
                        ? b.category
                        : "Monthly Budget";

                // 💡 Wenn Monthly Budget: alle Ausgaben summieren
                const spent = txData
                    ?.filter((t) => {
                        if (t.type !== "expense") return false;
                        if (!b.category || b.category.trim() === "") {
                            return true; // Monthly Budget → alle Ausgaben zählen
                        }
                        return t.category === b.category;
                    })
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                return {
                    ...b,
                    category: categoryName,
                    spent: spent || 0,
                };
            });

            // 4️⃣ Monthly Budget zuerst anzeigen
            const sorted = budgetsWithSpent.sort((a, b) =>
                a.category === "Monthly Budget" ? -1 : 1
            );

            setBudgets(sorted.slice(0, 6)); // max. 6 anzeigen
            setLoading(false);
        };

        fetchBudgets();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budgets</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {loading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Lädt ...
                    </p>
                ) : budgets.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Keine Budgets festgelegt.
                    </p>
                ) : (
                    budgets.map((b) => {
                        const used = b.limit > 0 ? b.spent / b.limit : 0;
                        const isMonthly = b.category === "Monthly Budget";

                        return (
                            <div key={b.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                  <span
                      className={`${
                          isMonthly
                              ? "text-primary font-semibold text-[0.95rem]"
                              : "font-medium text-foreground"
                      }`}
                  >
                    {b.category}
                  </span>
                                    <span className="text-muted-foreground">
                    {b.spent.toFixed(0)} / {b.limit.toFixed(0)} €
                  </span>
                                </div>
                                <Progress
                                    value={Math.min(used * 100, 100)}
                                    className={`h-2 ${
                                        isMonthly ? "bg-primary/20" : "bg-primary/10"
                                    }`}
                                />
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
