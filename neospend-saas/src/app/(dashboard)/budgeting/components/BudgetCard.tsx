"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Save, X, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../utils";

type Budget = {
    id: number;        // int8
    category: string;  // category name (matches categories.name)
    limit: number;
    spent: number;
};

export default function BudgetCard({
                                       budget,
                                       onUpdateLimit,
                                       onRemove,
                                   }: {
    budget: Budget;
    onUpdateLimit: (id: number, limit: number) => void;
    onRemove: (id: number) => void;
}) {
    const [editing, setEditing] = React.useState(false);
    const [limit, setLimit] = React.useState<number>(budget.limit);

    const pct = Math.min(100, Math.round((budget.spent / Math.max(1, budget.limit)) * 100));
    const over80 = pct >= 80 && pct < 100;
    const over100 = pct >= 100;

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            {budget.category}
                            {over80 && !over100 && (
                                <Badge variant="outline" className="gap-1 px-2 py-0.5 text-amber-600 dark:text-amber-400 border-amber-300/60">
                                    <AlertTriangle className="h-3.5 w-3.5" /> 80%+
                                </Badge>
                            )}
                            {over100 && (
                                <Badge variant="destructive" className="gap-1 px-2 py-0.5">
                                    <AlertTriangle className="h-3.5 w-3.5" /> Over limit
                                </Badge>
                            )}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)} used
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {editing ? (
                            <>
                                <Button size="icon" variant="outline" aria-label="Cancel" onClick={() => { setEditing(false); setLimit(budget.limit); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button size="icon" aria-label="Save" onClick={() => { onUpdateLimit(budget.id, Math.max(0, Number(limit))); setEditing(false); }}>
                                    <Save className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="icon" variant="outline" aria-label="Edit limit" onClick={() => setEditing(true)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" aria-label="Remove" onClick={() => onRemove(budget.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <Progress value={pct} />
                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Spent</div>
                        <div className="font-medium">{formatCurrency(budget.spent)}</div>
                    </div>
                    <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Remaining</div>
                        <div className="font-medium">{formatCurrency(Math.max(0, budget.limit - budget.spent))}</div>
                    </div>
                    <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Limit</div>
                        {editing ? (
                            <Input inputMode="decimal" value={String(limit)} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Monthly limit" />
                        ) : (
                            <div className="font-medium">{formatCurrency(budget.limit)}</div>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-end text-xs text-muted-foreground">
                {pct < 80 && <span>On track.</span>}
                {pct >= 80 && pct < 100 && <span>High spend — keep an eye on it.</span>}
                {pct >= 100 && <span>Limit exceeded. Consider adjusting.</span>}
            </CardFooter>
        </Card>
    );
}
