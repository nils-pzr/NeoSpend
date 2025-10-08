'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export type TrendPoint = { month: string; income: number; expense: number };

const LOCALE = 'de-DE';
const CURRENCY = 'EUR';
const fmtMoney = (v: number) => new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(v);
const fmtAxis = (v: number) => new Intl.NumberFormat(LOCALE, { notation: 'compact' }).format(v);

function toCumulative(data: TrendPoint[]) {
    let acc = 0;
    return data.map((d) => {
        acc += (d.income ?? 0) - (d.expense ?? 0);
        return { ...d, net: acc };
    });
}

export default function LineTrend({ data, loading }: { data: TrendPoint[]; loading?: boolean }) {
    if (loading) return <div className="h-full w-full animate-pulse rounded-md border border-dashed" />;

    const points = toCumulative(data);
    if (!points.length) return <div className="h-full grid place-items-center text-sm text-muted-foreground">No data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={fmtAxis} />
                <Tooltip formatter={(v: number) => fmtMoney(v)} labelFormatter={(l) => `Monat: ${l}`} />
                <Line type="monotone" dataKey="net" dot={false} stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}
