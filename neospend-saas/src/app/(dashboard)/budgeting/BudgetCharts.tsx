"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";
import { formatCurrency } from "./utils";
import { useTheme } from "next-themes";

/** ---- Farb-Logik (mit Fallbacks) ---- */
const FALLBACK_COLORS = [
    "hsl(262 83% 66%)",
    "hsl(199 89% 48%)",
    "hsl(142 71% 45%)",
    "hsl(20 90% 60%)",
    "hsl(48 96% 53%)",
    "hsl(12 85% 55%)",
    "hsl(280 70% 60%)",
    "hsl(328 88% 60%)",
];

function sanitizeColor(input?: string, idx = 0) {
    const v = (input ?? "").trim();
    if (!v) return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
    const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
    const isRgb = /^rgb(a)?\(/i.test(v);
    const isHsl = /^hsl(a)?\(/i.test(v);
    const isNamed = /^[a-zA-Z]+$/.test(v);
    return isHex || isRgb || isHsl || isNamed ? v : FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

type Totals = { limit: number; spent: number; remaining: number; pct: number };
type Tx = { id: string; categoryName: string | null; amount: number; type: "expense" | "income" };
type Cat = { id: string; name: string; color?: string };

export default function BudgetCharts({
                                         totals,
                                         transactions,
                                         categories = [],
                                     }: {
    totals: Totals;
    transactions: Tx[];
    categories?: Cat[];
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const tooltipBg = isDark ? "rgba(17,17,17,0.95)" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.15)" : "#e5e5e5";
    const tooltipText = isDark ? "#E5E5E5" : "#111111";

    /** ---- (Demo) Verlauf der letzten Monate ---- */
    const history = React.useMemo(
        () => [
            { month: "May", limit: 1200, spent: 900 },
            { month: "Jun", limit: 1100, spent: 870 },
            { month: "Jul", limit: 1300, spent: 1250 },
            { month: "Aug", limit: 1250, spent: 950 },
            { month: "Sep", limit: 1500, spent: 1380 },
            { month: "Oct", limit: totals.limit, spent: totals.spent },
        ],
        [totals.limit, totals.spent],
    );

    /** ---- Category Breakdown (Farben aus DB) ---- */
    const categoryStats = React.useMemo(() => {
        const sums: Record<string, number> = {};
        for (const tx of transactions) {
            if (tx.type !== "expense") continue;
            const key = (tx.categoryName ?? "Uncategorized").trim();
            sums[key] = (sums[key] ?? 0) + Math.abs(tx.amount);
        }

        return Object.entries(sums).map(([name, value], idx) => {
            const matched = categories.find(
                (c) => c.name?.trim().toLowerCase() === name.trim().toLowerCase(),
            );
            return {
                name,
                value,
                color: sanitizeColor(matched?.color, idx),
            };
        });
    }, [transactions, categories]);

    const totalSpent = totals.spent || 0;

    return (
        <div className="space-y-6">
            {/* 📊 Budget Trend */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <TrendingUp className="h-4 w-4" />
                        Budget Trend (Last 6 Months)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={history}>
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                formatter={(v, n) => [formatCurrency(Number(v)), String(n)]}
                                labelFormatter={(label) => `Month: ${label}`}
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBorder}`,
                                    borderRadius: "8px",
                                    color: tooltipText,
                                    backdropFilter: "blur(6px)",
                                    fontWeight: 500,
                                    padding: "8px 12px",
                                }}
                                labelStyle={{
                                    color: tooltipText,
                                    fontWeight: 600,
                                }}
                                itemStyle={{
                                    color: tooltipText,
                                }}
                            />
                            <Bar dataKey="limit" fill="#A491FF" name="Budget Limit" />
                            <Bar dataKey="spent" fill="#6C63FF" name="Spent" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 🥧 Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <PieIcon className="h-4 w-4" />
                        Category Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={categoryStats}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={3}
                                label={({ name, value }) =>
                                    totalSpent > 0
                                        ? `${name}: ${((Number(value) / totalSpent) * 100).toFixed(1)}%`
                                        : `${name}: 0%`
                                }
                            >
                                {categoryStats.map((d, i) => (
                                    <Cell
                                        key={`${d.name}-${i}`}
                                        fill={sanitizeColor(d.color, i)}
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip
                                formatter={(v, n) => [formatCurrency(Number(v)), String(n)]}
                                labelFormatter={(label) => String(label)}
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBorder}`,
                                    borderRadius: "8px",
                                    color: tooltipText,
                                    backdropFilter: "blur(6px)",
                                    fontWeight: 500,
                                    padding: "8px 12px",
                                }}
                                labelStyle={{
                                    color: tooltipText,
                                    fontWeight: 600,
                                }}
                                itemStyle={{
                                    color: tooltipText,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
