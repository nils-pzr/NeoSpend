"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

type TrendPoint = { month: string; income: number; expense: number; net: number };

export default function DashboardChart() {
    const [data, setData] = useState<TrendPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [primaryColor, setPrimaryColor] = useState("#7546E8"); // fallback
    const { theme } = useTheme();

    useEffect(() => {
        // ✅ CSS Variable korrekt auflösen
        const root = document.documentElement;
        const color = getComputedStyle(root).getPropertyValue("--primary").trim();
        if (color) setPrimaryColor(`hsl(${color})`);
    }, [theme]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: tx, error } = await supabase
                .from("transactions")
                .select("amount, type, date")
                .eq("user_id", user.id);

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            // === Gruppieren nach Monat ===
            const grouped: Record<
                string,
                { income: number; expense: number; date: Date }
            > = {};

            tx?.forEach((t) => {
                const d = new Date(t.date);
                const key = `${d.getFullYear()}-${d.getMonth()}`;
                if (!grouped[key]) grouped[key] = { income: 0, expense: 0, date: d };
                if (t.type === "income") grouped[key].income += Number(t.amount);
                if (t.type === "expense") grouped[key].expense += Number(t.amount);
            });

            // === Array umwandeln + chronologisch sortieren ===
            let cumulative = 0;
            const monthly = Object.values(grouped)
                .sort((a, b) => a.date.getTime() - b.date.getTime()) // alt → neu
                .map((m) => {
                    cumulative += m.income - m.expense;
                    return {
                        month: m.date.toLocaleString("de-DE", { month: "short" }),
                        income: m.income,
                        expense: m.expense,
                        net: cumulative,
                    };
                });

            setData(monthly);
            setLoading(false);
        };

        fetchData();
    }, []);

    const isDark = theme === "dark";
    const textColor = isDark ? "#E5E5E5" : "#111111";
    const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
    const tooltipBg = isDark ? "rgba(17,17,17,0.95)" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.15)" : "#e5e5e5";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monatsübersicht</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                {loading ? (
                    <div className="h-full w-full animate-pulse rounded-md border border-dashed" />
                ) : data.length === 0 ? (
                    <div className="h-full grid place-items-center text-sm text-muted-foreground">
                        Keine Daten vorhanden
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="month" tick={{ fill: textColor }} stroke={textColor} />
                            <YAxis
                                tick={{ fill: textColor }}
                                stroke={textColor}
                                tickFormatter={(v) =>
                                    Intl.NumberFormat(undefined, { notation: "compact" }).format(v)
                                }
                            />
                            <Tooltip
                                formatter={(v: number, name: string) =>
                                    [
                                        new Intl.NumberFormat(undefined, {
                                            style: "currency",
                                            currency: "EUR",
                                        }).format(v),
                                        name === "net"
                                            ? "Kumuliert"
                                            : name === "income"
                                                ? "Einnahmen"
                                                : "Ausgaben",
                                    ]
                                }
                                labelFormatter={(l) => `Monat: ${l}`}
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBorder}`,
                                    borderRadius: "8px",
                                    color: textColor,
                                    backdropFilter: "blur(4px)",
                                    fontWeight: 500,
                                    padding: "8px 12px",
                                }}
                                labelStyle={{
                                    color: textColor,
                                    fontWeight: 600,
                                }}
                                itemStyle={{
                                    color: textColor,
                                }}
                            />
                            {/* 🟩 Income */}
                            <Line
                                type="monotone"
                                dataKey="income"
                                strokeWidth={2}
                                stroke="#22c55e" // Tailwind green-500
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    stroke: "#22c55e",
                                    strokeWidth: 2,
                                }}
                            />
                            {/* 🟥 Expense */}
                            <Line
                                type="monotone"
                                dataKey="expense"
                                strokeWidth={2}
                                stroke="#ef4444" // Tailwind red-500
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    stroke: "#ef4444",
                                    strokeWidth: 2,
                                }}
                            />
                            {/* 💜 Net cumulative */}
                            <Line
                                type="monotone"
                                dataKey="net"
                                strokeWidth={2.5}
                                stroke={primaryColor}
                                dot={{
                                    r: 3.5,
                                    fill: primaryColor,
                                    stroke: isDark ? "#1a1a1a" : "#ffffff",
                                    strokeWidth: 1.5,
                                }}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 2,
                                    stroke: primaryColor,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
