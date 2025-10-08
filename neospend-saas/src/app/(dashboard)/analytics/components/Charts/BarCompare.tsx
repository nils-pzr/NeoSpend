'use client';

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
                                       expenseColor = 'hsl(0 84% 60%)',     // 🔴 Rot
                                       incomeColor = 'hsl(142 71% 45%)',     // 🟢 Grün
                                   }: {
    data: TrendPoint[];
    loading?: boolean;
    expenseColor?: string;
    incomeColor?: string;
}) {
    if (loading)
        return <div className="h-full w-full animate-pulse rounded-md border border-dashed" />;
    if (!data.length)
        return <div className="h-full grid place-items-center text-sm text-muted-foreground">No data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={fmtAxis} />
                <Tooltip formatter={(v: number) => fmtMoney(v)} />
                <Legend />
                {/* Reihenfolge in der Legende = Reihenfolge der Bars */}
                <Bar dataKey="expense" name="expense" fill={expenseColor} radius={[6, 6, 0, 0]} />
                <Bar dataKey="income"  name="income"  fill={incomeColor}  radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
