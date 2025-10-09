'use client';

import { useTheme } from 'next-themes';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from 'recharts';

type TopCategory = {
    category: string;
    total: number;
    color?: string;
};

export default function TopCategories({ data }: { data: TopCategory[] }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#E5E5E5' : '#111111';
    const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const tooltipBg = isDark ? 'rgba(17,17,17,0.95)' : '#ffffff';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e5e5';

    if (!data?.length)
        return (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
                No data
            </div>
        );

    const top = data.sort((a, b) => b.total - a.total).slice(0, 5);

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="category" tick={{ fill: textColor, fontSize: 12 }} stroke={textColor} />
                <YAxis
                    tickFormatter={(v) =>
                        new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(v)
                    }
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
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                    {top.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#7546E8'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
