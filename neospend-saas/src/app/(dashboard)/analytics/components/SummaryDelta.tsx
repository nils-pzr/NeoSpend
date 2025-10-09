'use client';

type TrendPoint = { month: string; income: number; expense: number };

export function calcDelta(trend: TrendPoint[]) {
    if (trend.length < 2) return { income: 0, expense: 0 };
    const [prev, current] = trend.slice(-2);
    const deltaIncome = ((current.income - prev.income) / (prev.income || 1)) * 100;
    const deltaExpense = ((current.expense - prev.expense) / (prev.expense || 1)) * 100;
    return { income: deltaIncome, expense: deltaExpense };
}

export default function SummaryDelta({ trend }: { trend: TrendPoint[] }) {
    const delta = calcDelta(trend);

    return (
        <div className="flex gap-6 text-sm mt-2 text-muted-foreground">
            <p>💰 Income vs last month: <span className={delta.income >= 0 ? 'text-green-600' : 'text-red-600'}>
        {delta.income.toFixed(1)}%
      </span></p>
            <p>💸 Expenses vs last month: <span className={delta.expense >= 0 ? 'text-red-600' : 'text-green-600'}>
        {delta.expense.toFixed(1)}%
      </span></p>
        </div>
    );
}
