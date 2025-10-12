"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Transaction {
    amount: number;
    type: "income" | "expense";
    date: string;
    user_id: string;
}

interface MonthlyData {
    month: string;
    income: number;
    expense: number;
    prev_income?: number;
    prev_expense?: number;
}

export default function DashboardChart() {
    const [data, setData] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [smooth, setSmooth] = useState(true);
    const [selectedRange, setSelectedRange] = useState("6m");
    const [showIncome, setShowIncome] = useState(true);
    const [showExpense, setShowExpense] = useState(true);
    const [showPrevYear, setShowPrevYear] = useState(true);
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data: tx, error } = await supabase
                .from("transactions")
                .select("amount, type, date, user_id")
                .eq("user_id", user.id);

            if (error || !tx) {
                console.error(error);
                setLoading(false);
                return;
            }

            // === Gruppiere nach Jahr + Monat ===
            const grouped: Record<
                string,
                { income: number; expense: number }
            > = {};

            tx.forEach((t) => {
                const date = new Date(t.date);
                const key = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
                if (t.type === "income") grouped[key].income += Number(t.amount);
                else grouped[key].expense += Number(t.amount);
            });

            // === Baue Datensätze ===
            const months = Object.entries(grouped)
                .map(([month, vals]) => ({
                    month,
                    income: vals.income,
                    expense: vals.expense,
                }))
                .sort((a, b) => a.month.localeCompare(b.month));

            // === Vorjahresdaten ermitteln ===
            const prevYearData = months.map((m) => {
                const [year, mm] = m.month.split("-");
                const prevKey = `${Number(year) - 1}-${mm}`;
                const prevVals = grouped[prevKey];
                return {
                    ...m,
                    prev_income: prevVals?.income ?? 0,
                    prev_expense: prevVals?.expense ?? 0,
                };
            });

            // === Zeitraum-Filter ===
            const now = new Date();
            let filtered = prevYearData;
            if (selectedRange === "6m") {
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(now.getMonth() - 6);
                filtered = prevYearData.filter(
                    (m) => new Date(m.month + "-01") >= sixMonthsAgo
                );
            } else if (selectedRange === "12m") {
                const twelveMonthsAgo = new Date(now);
                twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
                filtered = prevYearData.filter(
                    (m) => new Date(m.month + "-01") >= twelveMonthsAgo
                );
            }

            // === Summary ===
            const currentYear = now.getFullYear();
            const lastYear = currentYear - 1;
            const currentExpense = tx
                .filter(
                    (t) =>
                        t.type === "expense" &&
                        new Date(t.date).getFullYear() === currentYear
                )
                .reduce((a, b) => a + Number(b.amount), 0);
            const prevExpense = tx
                .filter(
                    (t) =>
                        t.type === "expense" &&
                        new Date(t.date).getFullYear() === lastYear
                )
                .reduce((a, b) => a + Number(b.amount), 0);

            const diff =
                prevExpense > 0
                    ? ((currentExpense - prevExpense) / prevExpense) * 100
                    : 0;

            let summaryText = "";
            if (diff < 0)
                summaryText = `🧠 Du gibst ${Math.abs(diff).toFixed(
                    1
                )}% weniger aus als im Vorjahreszeitraum.`;
            else if (diff > 0)
                summaryText = `🧠 Du gibst ${Math.abs(diff).toFixed(
                    1
                )}% mehr aus als im Vorjahreszeitraum.`;
            else summaryText = `🧠 Deine Ausgaben sind gleich geblieben.`;

            setSummary(summaryText);
            setData(filtered);
            setLoading(false);
        };

        fetchData();
    }, [selectedRange]);

    const monthsShort = [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ];

    const chartData = useMemo(
        () =>
            data.map((d) => ({
                ...d,
                label: `${monthsShort[Number(d.month.split("-")[1]) - 1]}`,
            })),
        [data]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monatsübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* === Header Controls === */}
                <div className="flex flex-wrap items-center gap-3 justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <label className="text-muted-foreground font-medium">Zeitraum</label>
                        <select
                            value={selectedRange}
                            onChange={(e) => setSelectedRange(e.target.value)}
                            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0
                         focus-visible:ring-[var(--primary)]"
                        >
                            <option value="6m">Letztes Halbjahr</option>
                            <option value="12m">Letztes Jahr</option>
                            <option value="24m">2 Jahre</option>
                            <option value="ytd">Dieses Jahr</option>
                        </select>

                        <label className="text-muted-foreground font-medium flex items-center gap-2">
                            Glättung
                            <input
                                type="checkbox"
                                checked={smooth}
                                onChange={() => setSmooth((p) => !p)}
                                className="accent-[var(--primary)] cursor-pointer"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowIncome((v) => !v)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                                showIncome
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-muted text-foreground"
                            }`}
                        >
                            🟩 Income
                        </button>
                        <button
                            onClick={() => setShowExpense((v) => !v)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                                showExpense
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-muted text-foreground"
                            }`}
                        >
                            🟥 Expense
                        </button>
                        <button
                            onClick={() => setShowPrevYear((v) => !v)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                                showPrevYear
                                    ? "bg-[var(--primary)] text-white"
                                    : "bg-muted text-foreground"
                            }`}
                        >
                            📈 Vorjahr
                        </button>
                    </div>
                </div>

                {/* === Chart === */}
                <div className="h-72 w-full">
                    {loading ? (
                        <div className="h-full w-full animate-pulse rounded-md border border-dashed" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="label" tickMargin={8} />
                                <YAxis tickMargin={8} />
                                <Tooltip
                                    formatter={(v: number, name: string) => [
                                        new Intl.NumberFormat("de-DE", {
                                            style: "currency",
                                            currency: "EUR",
                                        }).format(v),
                                        name === "income"
                                            ? "Einnahmen"
                                            : name === "expense"
                                                ? "Ausgaben"
                                                : name === "prev_income"
                                                    ? "Einnahmen (Vorjahr)"
                                                    : name === "prev_expense"
                                                        ? "Ausgaben (Vorjahr)"
                                                        : "",
                                    ]}
                                    labelFormatter={(l) => `Monat: ${l}`}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "12px",
                                        color: "#111111",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        padding: "10px 14px",
                                        fontWeight: 500,
                                    }}
                                    labelStyle={{
                                        color: "#111111",
                                        fontWeight: 600,
                                        marginBottom: 4,
                                    }}
                                    itemStyle={{
                                        color: "#111111",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.5,
                                    }}
                                />

                                {showIncome && (
                                    <Line
                                        type={smooth ? "monotone" : "linear"}
                                        dataKey="income"
                                        stroke="#16a34a"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                )}
                                {showExpense && (
                                    <Line
                                        type={smooth ? "monotone" : "linear"}
                                        dataKey="expense"
                                        stroke="#dc2626"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                )}
                                {showPrevYear && (
                                    <>
                                        <Line
                                            type="monotone"
                                            dataKey="prev_income"
                                            stroke="#16a34a"
                                            strokeDasharray="5 5"
                                            strokeWidth={1.5}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="prev_expense"
                                            stroke="#dc2626"
                                            strokeDasharray="5 5"
                                            strokeWidth={1.5}
                                            dot={false}
                                        />
                                    </>
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* === AI Summary === */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`text-center text-sm font-medium ${
                        summary.includes("mehr")
                            ? "text-red-500"
                            : summary.includes("weniger")
                                ? "text-green-500"
                                : "text-muted-foreground"
                    }`}
                >
                    {summary}
                </motion.p>
            </CardContent>
        </Card>
    );
}
