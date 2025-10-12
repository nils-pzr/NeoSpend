// app/(dashboard)/dashboard/components/KPICards.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";

type KPI = {
    title: string;
    value: string;
    hint?: string;
    icon: React.ComponentType<{ className?: string }>;
    good?: boolean | null; // true = positive, false = negative, null = neutral
};

function formatCurrency(n: number, currency = "EUR", locale?: string) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(n);
}

export default function KPICards({
                                     data,
                                 }: {
    data?: {
        balance: number;
        income: number;
        expenses: number;
        savingsRate: number; // 0..1
        incomeDelta?: number; // vs last month
        expensesDelta?: number; // vs last month
    };
}) {
    const d = data ?? {
        balance: 12480,
        income: 3200,
        expenses: 2780,
        savingsRate: 0.13,
        incomeDelta: 0.12,
        expensesDelta: -0.05,
    };

    const cards: KPI[] = [
        {
            title: "Balance",
            value: formatCurrency(d.balance),
            hint: "as of today",
            icon: Wallet,
            good: null,
        },
        {
            title: "Income",
            value: formatCurrency(d.income),
            hint:
                (d.incomeDelta ?? 0) >= 0
                    ? `+${Math.round((d.incomeDelta ?? 0) * 100)}% from last month`
                    : `${Math.round((d.incomeDelta ?? 0) * 100)}% from last month`,
            icon: TrendingUp,
            good: true,
        },
        {
            title: "Expenses",
            value: formatCurrency(d.expenses),
            hint:
                (d.expensesDelta ?? 0) <= 0
                    ? `${Math.round(-(d.expensesDelta ?? 0) * 100)}% from last month`
                    : `+${Math.round((d.expensesDelta ?? 0) * 100)}% from last month`,
            icon: TrendingDown,
            good: false,
        },
        {
            title: "Savings Rate",
            value: `${Math.round(d.savingsRate * 100)}%`,
            hint: "steady this month",
            icon: PiggyBank,
            good: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{kpi.value}</div>
                        {kpi.hint ? (
                            <p
                                className={
                                    "text-xs mt-1 " +
                                    (kpi.good === true
                                        ? "text-emerald-600 dark:text-emerald-500"
                                        : kpi.good === false
                                            ? "text-rose-600 dark:text-rose-500"
                                            : "text-muted-foreground")
                                }
                            >
                                {kpi.hint}
                            </p>
                        ) : null}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
