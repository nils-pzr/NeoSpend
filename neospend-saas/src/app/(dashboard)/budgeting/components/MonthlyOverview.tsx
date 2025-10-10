"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Settings2, Save, Pencil, X, Lock } from "lucide-react";
import Stat from "./Stat";
import { formatCurrency } from "../utils";
import { getBudgetSettings, updateCarryOverSetting } from "../actions";

type Totals = {
    limit: number;
    spent: number;
    remaining: number;
    pct: number;
};

export default function MonthlyOverview({
                                            totals,
                                            monthlyBudgetLimit,
                                            onUpdateMonthlyBudgetLimit,
                                        }: {
    totals: Totals;
    monthlyBudgetLimit?: number | null;
    onUpdateMonthlyBudgetLimit?: (limit: number) => void;
}) {
    const [editing, setEditing] = React.useState(false);
    const [limit, setLimit] = React.useState<number>(monthlyBudgetLimit ?? totals.limit);
    const [carryOver, setCarryOver] = React.useState(false);

    React.useEffect(() => {
        setLimit(monthlyBudgetLimit ?? totals.limit);
    }, [monthlyBudgetLimit, totals.limit]);

    React.useEffect(() => {
        getBudgetSettings().then((s) => setCarryOver(Boolean(s?.carry_over_enabled)));
    }, []);

    async function toggleCarryOver(v: boolean) {
        setCarryOver(v);
        try {
            await updateCarryOverSetting(v);
        } catch (e) {
            setCarryOver(!v);
            console.error(e);
        }
    }

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" /> Monthly Overview
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat label="Total budget" value={formatCurrency(monthlyBudgetLimit ?? totals.limit)} />
                    <Stat label="Spent" value={formatCurrency(totals.spent)} />
                    <Stat
                        label="Remaining"
                        value={formatCurrency((monthlyBudgetLimit ?? totals.limit) - totals.spent)}
                        highlight={(monthlyBudgetLimit ?? totals.limit) - totals.spent < (monthlyBudgetLimit ?? totals.limit) * 0.2}
                    />
                    <Stat label="Used" value={`${totals.pct}%`} />
                </div>

                <Progress value={totals.pct} />
            </CardContent>

            <CardFooter className="justify-between">
                <div className="text-xs text-muted-foreground">
                    Tip: Keep a buffer for unexpected expenses.
                </div>

                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <Input
                                inputMode="decimal"
                                className="h-9 w-32"
                                value={String(limit)}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                aria-label="Monthly total budget"
                            />
                            <Button
                                size="icon"
                                aria-label="Save monthly budget"
                                onClick={() => {
                                    onUpdateMonthlyBudgetLimit?.(Math.max(0, Number(limit)));
                                    setEditing(false);
                                }}
                            >
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Cancel"
                                onClick={() => {
                                    setEditing(false);
                                    setLimit(monthlyBudgetLimit ?? totals.limit);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
              <span className="text-sm text-muted-foreground">
                Monthly total:{" "}
                  <strong>{formatCurrency(monthlyBudgetLimit ?? totals.limit)}</strong>
              </span>
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Edit monthly budget"
                                onClick={() => setEditing(true)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* ⚙️ Monthly Settings Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Settings2 className="h-4 w-4" /> Monthly settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Monthly budget settings</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-5 py-2">
                                {/* ✅ Toggle: Carry-over */}
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="carry-over">Enable carry-over</Label>
                                    <Switch
                                        id="carry-over"
                                        checked={carryOver}
                                        onCheckedChange={toggleCarryOver}
                                    />
                                </div>

                                {/* 🌙 ROLLOVERS */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Rollovers</div>
                                        <p className="text-sm text-muted-foreground">
                                            Automatically roll over unused limits between months.
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="gap-1">
                                        <Lock className="h-3.5 w-3.5" /> Coming soon
                                    </Badge>
                                </div>

                                {/* 💰 AUTO-ALLOCATE FROM INCOME */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Auto-allocate from income</div>
                                        <p className="text-sm text-muted-foreground">
                                            Distribute income to categories by rules or percentages.
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="gap-1">
                                        <Lock className="h-3.5 w-3.5" /> Coming soon
                                    </Badge>
                                </div>

                                {/* ♻️ RESET RULES */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Reset rules</div>
                                        <p className="text-sm text-muted-foreground">
                                            Choose how monthly limits reset (zero / keep / average).
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="gap-1">
                                        <Lock className="h-3.5 w-3.5" /> Coming soon
                                    </Badge>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    );
}
