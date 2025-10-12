"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KPICards() {
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data: tx } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id);

            const incomeSum =
                tx?.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0) || 0;
            const expenseSum =
                tx?.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0) || 0;

            setIncome(incomeSum);
            setExpenses(expenseSum);
            setBalance(incomeSum - expenseSum);
        };

        fetchData();
    }, []);

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Balance</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                    {balance.toFixed(2)} €
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Income</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold text-green-500">
                    +{income.toFixed(2)} €
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold text-red-500">
                    −{expenses.toFixed(2)} €
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Savings Rate</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                    {savingsRate.toFixed(1)} %
                </CardContent>
            </Card>
        </div>
    );
}
