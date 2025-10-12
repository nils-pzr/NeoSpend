"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
}

export default function RecentTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return setLoading(false);

            const { data } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false })
                .limit(5);

            setTransactions(data || []);
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Letzte Transaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {loading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Lädt ...
                    </p>
                ) : recent.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Noch keine Transaktionen vorhanden.
                    </p>
                ) : (
                    recent.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                            <div>
                                <p className="text-sm font-medium">{t.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(t.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div
                                className={`text-sm font-medium tabular-nums ${
                                    t.type === "income"
                                        ? "text-emerald-600 dark:text-emerald-500"
                                        : "text-rose-600 dark:text-rose-500"
                                }`}
                            >
                                {t.type === "income" ? "+" : "-"}
                                {t.amount.toFixed(2)} €
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
