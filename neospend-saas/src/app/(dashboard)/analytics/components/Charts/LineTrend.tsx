'use client';

import { useTheme } from 'next-themes';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

type TrendPoint = { month: string; income: number; expense: number };

function toCumulative(data: TrendPoint[]) {
    let acc = 0;
    return data.map((d) => {
        acc += (d.income ?? 0) - (d.expense ?? 0);
        // @ts-ignore – wir erweitern um net für den Chart
        return { ...d, net: acc };
    });
}

export default function LineTrend({
                                      data,
                                      loading,
                                  }: {
    data: TrendPoint[];
    loading?: boolean;
}) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#E5E5E5' : '#111111';
    const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const tooltipBg = isDark ? 'rgba(17,17,17,0.95)' : '#ffffff';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e5e5';

    if (loading)
        return (
            <div className="h-full w-full animate-pulse rounded-md border border-dashed" />
        );

    const points = toCumulative(data);
    if (!points.length) {
        return (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
                No data
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor }} stroke={textColor} />
                <YAxis
                    tick={{ fill: textColor }}
                    stroke={textColor}
                    tickFormatter={(v) =>
                        Intl.NumberFormat(undefined, { notation: 'compact' }).format(v)
                    }
                />
                <Tooltip
                    formatter={(v: number) =>
                        new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        }).format(v)
                    }
                    labelFormatter={(l) => `Month: ${l}`}
                    contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: '8px',
                        color: textColor,
                        backdropFilter: 'blur(4px)',
                        fontWeight: 500,
                        padding: '8px 12px',
                    }}
                    labelStyle={{
                        color: textColor,
                        fontWeight: 600,
                    }}
                    itemStyle={{
                        color: textColor,
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="net"
                    dot={{
                        r: 4,
                        fill: 'hsl(262 83% 66%)',
                        stroke: isDark ? '#1a1a1a' : '#ffffff',
                        strokeWidth: 1.5,
                    }}
                    activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        stroke: 'hsl(262 83% 66%)',
                    }}
                    strokeWidth={2}
                    stroke="hsl(262 83% 66%)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
