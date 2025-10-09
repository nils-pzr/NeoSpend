'use client';

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LOCALE = 'de-DE';
const CURRENCY = 'EUR';

type TrendPoint = { month: string; income: number; expense: number };
type Mode = 'income' | 'expense' | 'balance';

const formatCurrency = (v: number) =>
    new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(v);

function computeDelta(trend: TrendPoint[], mode: Mode) {
    if (trend.length < 2) return 0;
    const last = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    const lastVal = mode === 'income' ? last.income : mode === 'expense' ? last.expense : last.income - last.expense;
    const prevVal = mode === 'income' ? prev.income : mode === 'expense' ? prev.expense : prev.income - prev.expense;
    if (prevVal === 0) return lastVal === 0 ? 0 : 100;
    return ((lastVal - prevVal) / Math.abs(prevVal)) * 100;
}

export default function SummaryCard({
                                        title,
                                        value,
                                        trend,
                                        mode,
                                    }: {
    title: string;
    value: number;
    trend: TrendPoint[];
    mode: Mode;
}) {
    const delta = computeDelta(trend, mode);
    const positive = mode === 'expense' ? delta < 0 : delta >= 0;
    const Icon = mode === 'income' ? TrendingUp : mode === 'expense' ? TrendingDown : Activity;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold tabular-nums">{formatCurrency(value)}</div>
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {positive ? '↑' : '↓'} {isFinite(delta) ? delta.toFixed(1) : '0.0'}% vs prev. month
                </p>
            </CardContent>
        </Card>
    );
}
