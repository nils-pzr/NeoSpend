'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type PieDatum = { name: string; value: number; color?: string };

const LOCALE = 'de-DE';
const CURRENCY = 'EUR';
const fmtMoney = (v: number) =>
    new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(v);

const FALLBACK_COLORS = [
    'hsl(262 83% 66%)',
    'hsl(199 89% 48%)',
    'hsl(142 71% 45%)',
    'hsl(20 90% 60%)',
    'hsl(48 96% 53%)',
    'hsl(12 85% 55%)',
    'hsl(280 70% 60%)',
    'hsl(328 88% 60%)',
];

// simple “validation”, sonst Fallback
function sanitizeColor(input?: string, idx = 0) {
    const v = (input ?? '').trim();
    if (!v) return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
    const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
    const isRgb = /^rgb(a)?\(/i.test(v);
    const isHsl = /^hsl(a)?\(/i.test(v);
    const isNamed = /^[a-zA-Z]+$/.test(v);
    if (isHex || isRgb || isHsl || isNamed) return v;
    return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

export default function PieCategory({ data, loading }: { data: PieDatum[]; loading?: boolean }) {
    if (loading) return <div className="h-full w-full animate-pulse rounded-md border border-dashed" />;

    const hasData = data && data.length > 0 && data.some((d) => d.value > 0);
    if (!hasData) return <div className="h-full grid place-items-center text-sm text-muted-foreground">No data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={64} outerRadius={108} paddingAngle={2}>
                    {data.map((d, i) => (
                        <Cell key={`${d.name}-${i}`} fill={sanitizeColor(d.color, i)} strokeWidth={2} stroke="#ffffff" />
                    ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmtMoney(v)} labelFormatter={(label) => String(label)} />
            </PieChart>
        </ResponsiveContainer>
    );
}
