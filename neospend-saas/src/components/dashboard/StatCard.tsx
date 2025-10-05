// src/components/dashboard/StatCard.tsx
import { Card, CardContent } from '@/components/ui/card';

export function StatCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{title}</div>
                <div className="text-2xl font-semibold">{value}</div>
                {hint ? <div className="text-xs text-muted-foreground mt-1">{hint}</div> : null}
            </CardContent>
        </Card>
    );
}