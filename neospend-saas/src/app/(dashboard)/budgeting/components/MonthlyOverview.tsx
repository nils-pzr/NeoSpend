"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BarChart2, Settings2, Save, Pencil, X } from "lucide-react";
import Stat from "./Stat";
import { formatCurrency } from "../utils";

type Totals = { limit: number; spent: number };

export default function MonthlyOverview({
                                            totals,
                                            monthlyBudgetLimit,
                                            onUpdateMonthlyBudgetLimit,
                                        }: {
    totals: Totals;
    monthlyBudgetLimit: number | null;
    onUpdateMonthlyBudgetLimit: (limit: number) => void;
}) {
    const [editing, setEditing] = React.useState(false);
    const currentLimit = monthlyBudgetLimit ?? totals.limit;
    const [limitInput, setLimitInput] = React.useState<number>(currentLimit);
    const usedPct = Math.min(100, Math.round((totals.spent / Math.max(1, currentLimit)) * 100));

    React.useEffect(() => setLimitInput(currentLimit), [currentLimit]);

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" /> Monthly Overview
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat label="Total budget" value={formatCurrency(currentLimit)} />
                    <Stat label="Spent" value={formatCurrency(totals.spent)} />
                    <Stat
                        label="Remaining"
                        value={formatCurrency(Math.max(0, currentLimit - totals.spent))}
                        highlight={currentLimit - totals.spent < currentLimit * 0.2}
                    />
                    <Stat label="Used" value={`${usedPct}%`} />
                </div>
                <Progress value={usedPct} />
            </CardContent>

            <CardFooter className="justify-between">
                <div className="text-xs text-muted-foreground">Tip: Keep a buffer for unexpected expenses.</div>
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <Input
                                inputMode="decimal"
                                className="h-9 w-32"
                                value={String(limitInput)}
                                onChange={(e) => setLimitInput(Number(e.target.value))}
                                aria-label="Monthly total budget"
                            />
                            <Button size="icon" aria-label="Save monthly budget" onClick={() => { onUpdateMonthlyBudgetLimit(Math.max(0, Number(limitInput))); setEditing(false); }}>
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" aria-label="Cancel" onClick={() => { setEditing(false); setLimitInput(currentLimit); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <span className="text-sm text-muted-foreground">Monthly total: <strong>{formatCurrency(currentLimit)}</strong></span>
                            <Button size="icon" variant="outline" aria-label="Edit monthly budget" onClick={() => setEditing(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2"><Settings2 className="h-4 w-4" /> Monthly settings</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>Monthly budget settings</DialogTitle></DialogHeader>
                            <div className="text-sm text-muted-foreground">(Coming soon) Rollovers, auto-allocate from income, reset rules.</div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    );
}
