'use client';

import { useTheme } from 'next-themes';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type DayData = { date: string; income: number; expense: number };

export default function DailyTrend({ data }: { data: DayData[] }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tooltipBg = isDark ? 'rgba(17,17,17,0.95)' : '#ffffff';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e5e5';
    const textColor = isDark ? '#E5E5E5' : '#111111';
    const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

    if (!data.length)
        return <div className="h-full grid place-items-center text-sm text-muted-foreground">No data</div>;

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: textColor }} stroke={textColor} />
                <YAxis
                    tickFormatter={(v) => new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(v)}
                    tick={{ fill: textColor }}
                    stroke={textColor}
                />
                <Tooltip
                    formatter={(v: number) =>
                        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v)
                    }
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
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
