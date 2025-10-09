'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Filters, { FiltersState } from './Filters';
import SummaryCard from './Charts/SummaryCard';
import ChartCard from './Charts/ChartCard';
import PieCategory from './Charts/PieCategory';
import LineTrend from './Charts/LineTrend';
import BarCompare from './Charts/BarCompare';
import TopCategories from './Charts/TopCategories';
import DailyTrend from './Charts/DailyTrend';

type SummaryRow = { total_income: number; total_expense: number; balance: number };
export type TrendPoint = { month: string; income: number; expense: number };

type DayData = { date: string; income: number; expense: number };

// Fallback-Daterange
const FALLBACK_FROM = '1900-01-01';
const FALLBACK_TO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export default function AnalyticsClient({ uid }: { uid: string | null }) {
    const [filters, setFilters] = useState<FiltersState>({ from: '', to: '' });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError | { message: string } | null>(null);

    const [summary, setSummary] = useState<SummaryRow | null>(null);
    const [monthly, setMonthly] = useState<TrendPoint[]>([]);
    const [pieData, setPieData] = useState<Array<{ name: string; value: number; color?: string }>>([]);
    const [daily, setDaily] = useState<DayData[]>([]);

    useEffect(() => {
        let mounted = true;

        async function load() {
            if (!uid) {
                setSummary(null);
                setMonthly([]);
                setPieData([]);
                setDaily([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const from_date = filters.from?.trim() ? filters.from : FALLBACK_FROM;
            const to_date = filters.to?.trim() ? filters.to : FALLBACK_TO();

            try {
                const [sumRes, trendRes, pieRes, txRes] = await Promise.all([
                    supabase.rpc('get_summary', { uid, from_date, to_date }),
                    supabase.rpc('get_monthly_trend', { uid, from_date, to_date }),
                    supabase.rpc('get_category_spending_with_color', { from_date, to_date }),
                    // tägliche Daten aus transactions (letzte 30 Tage)
                    supabase
                        .from('transactions')
                        .select('date, amount, type')
                        .eq('user_id', uid)
                        .gte('date', from_date)
                        .lte('date', to_date)
                        .order('date', { ascending: true }),
                ]);

                if (!mounted) return;

                if (sumRes.error) throw sumRes.error;
                if (trendRes.error) throw trendRes.error;
                if (pieRes.error) throw pieRes.error;
                if (txRes.error) throw txRes.error;

                const s = sumRes.data?.[0] ?? { total_income: 0, total_expense: 0, balance: 0 };
                setSummary({
                    total_income: Number(s.total_income ?? 0),
                    total_expense: Number(s.total_expense ?? 0),
                    balance: Number(s.balance ?? 0),
                });

                setMonthly(
                    (trendRes.data ?? []).map((r: any) => ({
                        month: String(r.month),
                        income: Number(r.income ?? 0),
                        expense: Number(r.expense ?? 0),
                    })),
                );

                setPieData(
                    (pieRes.data ?? []).map((r: any) => ({
                        name: String(r.category ?? 'Uncategorized'),
                        value: Number(r.total ?? 0),
                        color: r.color ? String(r.color) : undefined,
                    })),
                );

                // Daily aggregation (lokal)
                const map = new Map<string, { income: number; expense: number }>();
                (txRes.data ?? []).forEach((t: any) => {
                    const d = String(t.date); // already yyyy-mm-dd
                    const cur = map.get(d) ?? { income: 0, expense: 0 };
                    if (t.type === 'income') cur.income += Number(t.amount || 0);
                    else if (t.type === 'expense') cur.expense += Number(t.amount || 0);
                    map.set(d, cur);
                });
                const days = Array.from(map.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([date, v]) => ({ date, income: v.income, expense: v.expense }));
                setDaily(days);
            } catch (e: any) {
                console.error('[analytics rpc error]', e);
                setError({ message: e?.message ?? 'Failed to load analytics' });
                setSummary(null);
                setMonthly([]);
                setPieData([]);
                setDaily([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [uid, filters]);

    const income = useMemo(() => Number(summary?.total_income ?? 0), [summary]);
    const expenses = useMemo(() => Number(summary?.total_expense ?? 0), [summary]);
    const balance = useMemo(() => Number(summary?.balance ?? 0), [summary]);

    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                <Button variant="outline" onClick={() => setFilters({ from: '', to: '' })}>
                    Reset
                </Button>
            </div>

            <Filters value={filters} onChange={setFilters} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard title="Income" value={income} trend={monthly} mode="income" />
                <SummaryCard title="Expenses" value={expenses} trend={monthly} mode="expense" />
                <SummaryCard title="Balance" value={balance} trend={monthly} mode="balance" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Spending by Category" subtitle="Sum of expenses in current filter">
                    <PieCategory data={pieData} loading={loading} />
                </ChartCard>

                <ChartCard title="Income vs Expenses by Month" subtitle="Monthly totals">
                    <BarCompare data={monthly} loading={loading} />
                </ChartCard>

                <ChartCard title="Top Categories" subtitle="Top 5 spending categories">
                    <TopCategories
                        data={pieData.map((p) => ({
                            category: p.name,
                            total: p.value,
                            color: p.color,
                        }))}
                    />
                </ChartCard>

                <ChartCard title="Daily Trend (last 30 days)" subtitle="Short-term activity">
                    <DailyTrend data={daily} />
                </ChartCard>

                <ChartCard className="lg:col-span-2" title="Trend Over Time" subtitle="Cumulative net balance">
                    <LineTrend data={monthly} loading={loading} />
                </ChartCard>
            </div>

            {error && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">{error.message}</CardContent>
                </Card>
            )}
        </div>
    );
}
