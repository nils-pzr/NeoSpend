'use client';

import { useTheme } from 'next-themes';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';

export type TrendPoint = { month: string; income: number; expense: number };

const LOCALE = 'de-DE';
const CURRENCY = 'EUR';
const fmtMoney = (v: number) =>
    new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(v);
const fmtAxis = (v: number) =>
    new Intl.NumberFormat(LOCALE, { notation: 'compact' }).format(v);

export default function BarCompare({
                                       data,
                                       loading,
                                       expenseColor = 'hsl(0 84% 60%)', // 🔴 Rot
                                       incomeColor = 'hsl(142 71% 45%)', // 🟢 Grün
                                   }: {
    data: TrendPoint[];
    loading?: boolean;
    expenseColor?: string;
    incomeColor?: string;
}) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tooltipBg = isDark ? 'rgba(17,17,17,0.95)' : '#ffffff';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e5e5';
    const textColor = isDark ? '#E5E5E5' : '#111111';

    if (loading)
        return <div className="h-full w-full animate-pulse rounded-md border border-dashed" />;
    if (!data.length)
        return (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
                No data
            </div>
        );

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={textColor} tick={{ fill: textColor }} />
                <YAxis tickFormatter={fmtAxis} stroke={textColor} tick={{ fill: textColor }} />
                <Tooltip
                    formatter={(v: number) => fmtMoney(v)}
                    contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: '8px',
                        color: textColor,
                        backdropFilter: 'blur(4px)',
                        fontWeight: 500,
                    }}
                    labelStyle={{
                        color: textColor,
                        fontWeight: 600,
                    }}
                    itemStyle={{
                        color: textColor,
                    }}
                />
                <Legend />
                <Bar dataKey="expense" name="expense" fill={expenseColor} radius={[6, 6, 0, 0]} />
                <Bar dataKey="income" name="income" fill={incomeColor} radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
