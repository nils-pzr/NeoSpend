"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    BarChart2,
    Settings2,
    Save,
    Pencil,
    X,
    RefreshCcw,
    RotateCw,
} from "lucide-react";
import Stat from "./Stat";
import { formatCurrency } from "../utils";
import {
    getBudgetSettings,
    updateCarryOverSetting,
    updateAutoAllocateSetting,
    updateAutoAllocateMode,
    updateResetRuleSetting,
    applyCarryOver,
    applyAutoAllocate,
    applyResetRules,
} from "../actions";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// 🧩 Neue Server-Action für Recalculate (statt initBudgeting Import)
import { runMaintenanceAction } from "../actions/runMaintenanceAction";

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
    const [limit, setLimit] = React.useState<number>(
        monthlyBudgetLimit ?? totals.limit
    );

    // Settings
    const [carryOver, setCarryOver] = React.useState(false);
    const [autoAllocate, setAutoAllocate] = React.useState(false);
    const [autoAllocateMode, setAutoAllocateMode] =
        React.useState<"even" | "percentage">("even");
    const [resetRule, setResetRule] =
        React.useState<"zero" | "keep" | "average">("keep");
    const [loadingAction, setLoadingAction] = React.useState<string | null>(null);

    /* --------------------------
       Sync Local States
    -------------------------- */
    React.useEffect(() => {
        setLimit(monthlyBudgetLimit ?? totals.limit);
    }, [monthlyBudgetLimit, totals.limit]);

    React.useEffect(() => {
        (async () => {
            const s = await getBudgetSettings();
            if (s) {
                setCarryOver(Boolean(s.carry_over_enabled));
                setAutoAllocate(Boolean(s.auto_allocate_enabled));
                setAutoAllocateMode(
                    (s.auto_allocate_mode as "even" | "percentage") ?? "even"
                );
                setResetRule((s.reset_rule as "zero" | "keep" | "average") ?? "keep");
            }
        })();
    }, []);

    /* --------------------------
       Warnung bei 90 %
    -------------------------- */
    React.useEffect(() => {
        if (totals.pct >= 90) {
            toast.warning("⚠️ You’ve used over 90% of your total budget this month!");
        }
    }, [totals.pct]);

    /* --------------------------
       Settings-Funktionen
    -------------------------- */
    async function toggleCarryOver(v: boolean) {
        setCarryOver(v);
        try {
            await updateCarryOverSetting(v);
            toast.success(v ? "Carry-over enabled" : "Carry-over disabled");
        } catch {
            toast.error("Failed to update carry-over");
            setCarryOver(!v);
        }
    }

    async function toggleAutoAllocate(v: boolean) {
        setAutoAllocate(v);
        try {
            await updateAutoAllocateSetting(v);
            toast.success(v ? "Auto-allocate enabled" : "Auto-allocate disabled");
        } catch {
            toast.error("Failed to update auto-allocate");
            setAutoAllocate(!v);
        }
    }

    async function changeAutoAllocateMode(v: "even" | "percentage") {
        setAutoAllocateMode(v);
        try {
            await updateAutoAllocateMode(v);
            toast.success(`Auto-allocate mode set to ${v}`);
        } catch {
            toast.error("Failed to update auto-allocate mode");
        }
    }

    async function changeResetRule(v: "zero" | "keep" | "average") {
        setResetRule(v);
        try {
            await updateResetRuleSetting(v);
            toast.success(`Reset rule set to ${v}`);
        } catch {
            toast.error("Failed to update reset rule");
        }
    }

    async function handleApply(action: "carry" | "allocate" | "reset") {
        try {
            setLoadingAction(action);
            if (action === "carry") {
                await applyCarryOver();
                toast.success("Carry-over applied successfully");
            } else if (action === "allocate") {
                await applyAutoAllocate();
                toast.success("Auto-allocation completed");
            } else if (action === "reset") {
                await applyResetRules();
                toast.success("Reset rules applied");
            }
        } catch {
            toast.error("Action failed");
        } finally {
            setLoadingAction(null);
        }
    }

    async function handleFullRecalc() {
        try {
            setLoadingAction("full");
            const result = await runMaintenanceAction();
            if (result?.success) {
                toast.success("Monthly budgets recalculated successfully");
            } else {
                toast.error(result?.error || "Failed to recalculate monthly budgets");
            }
        } catch {
            toast.error("Failed to recalculate monthly budgets");
        } finally {
            setLoadingAction(null);
        }
    }

    /* --------------------------
       Render
    -------------------------- */
    return (
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" /> Monthly Overview
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Stat
                        label="Total budget"
                        value={formatCurrency(monthlyBudgetLimit ?? totals.limit)}
                    />
                    <Stat label="Spent" value={formatCurrency(totals.spent)} />
                    <Stat
                        label="Remaining"
                        value={formatCurrency(
                            (monthlyBudgetLimit ?? totals.limit) - totals.spent
                        )}
                        highlight={
                            (monthlyBudgetLimit ?? totals.limit) - totals.spent <
                            (monthlyBudgetLimit ?? totals.limit) * 0.2
                        }
                    />
                    <Stat label="Used" value={`${totals.pct ?? 0}%`} />
                </div>

                <Progress value={totals.pct} />
            </CardContent>

            <CardFooter className="justify-between">
                <div className="text-xs text-muted-foreground">
                    Tip: Keep a buffer for unexpected expenses.
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* 🧮 Recalculate Button */}
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingAction === "full"}
                        onClick={handleFullRecalc}
                        className="flex items-center gap-2"
                    >
                        <RotateCw
                            className={cn(
                                "h-4 w-4",
                                loadingAction === "full" && "animate-spin"
                            )}
                        />
                        Recalculate Monthly Budgets
                    </Button>

                    {/* ✏️ Budget Edit */}
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
                                <strong>
                                    {formatCurrency(monthlyBudgetLimit ?? totals.limit)}
                                </strong>
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

                            <div className="grid gap-5 py-3">
                                {/* ✅ Carry-over */}
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="carry-over">Enable carry-over</Label>
                                    <Switch
                                        id="carry-over"
                                        checked={carryOver}
                                        onCheckedChange={toggleCarryOver}
                                    />
                                </div>

                                <Button
                                    onClick={() => handleApply("carry")}
                                    size="sm"
                                    disabled={loadingAction === "carry"}
                                    className="w-full flex items-center gap-2"
                                >
                                    <RefreshCcw
                                        className={cn(
                                            "h-4 w-4",
                                            loadingAction === "carry" && "animate-spin"
                                        )}
                                    />
                                    Apply Carry-Over Now
                                </Button>

                                <Separator className="my-2" />

                                {/* 💰 Auto-allocate */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="auto-allocate">
                                            Auto-allocate from income
                                        </Label>
                                        <Switch
                                            id="auto-allocate"
                                            checked={autoAllocate}
                                            onCheckedChange={toggleAutoAllocate}
                                        />
                                    </div>

                                    <div
                                        className={cn(
                                            "flex justify-between items-center",
                                            !autoAllocate && "opacity-50"
                                        )}
                                    >
                                        <Label htmlFor="allocate-mode">Mode</Label>
                                        <select
                                            id="allocate-mode"
                                            disabled={!autoAllocate}
                                            value={autoAllocateMode}
                                            onChange={(e) =>
                                                changeAutoAllocateMode(
                                                    e.target.value as "even" | "percentage"
                                                )
                                            }
                                            className="border border-border rounded-md px-2 py-1 text-sm"
                                        >
                                            <option value="even">Distribute evenly</option>
                                            <option value="percentage">By percentages</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleApply("allocate")}
                                    size="sm"
                                    disabled={loadingAction === "allocate"}
                                    className="w-full flex items-center gap-2"
                                >
                                    <RefreshCcw
                                        className={cn(
                                            "h-4 w-4",
                                            loadingAction === "allocate" && "animate-spin"
                                        )}
                                    />
                                    Apply Auto-Allocation Now
                                </Button>

                                <Separator className="my-2" />

                                {/* ♻️ Reset rules */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="reset-rule">Reset rule</Label>
                                    <select
                                        id="reset-rule"
                                        value={resetRule}
                                        onChange={(e) =>
                                            changeResetRule(
                                                e.target.value as
                                                    | "zero"
                                                    | "keep"
                                                    | "average"
                                            )
                                        }
                                        className="border border-border rounded-md px-2 py-1 text-sm"
                                    >
                                        <option value="zero">Reset to zero</option>
                                        <option value="keep">Keep previous limit</option>
                                        <option value="average">
                                            Average of last 3 months
                                        </option>
                                    </select>
                                </div>

                                <Button
                                    onClick={() => handleApply("reset")}
                                    size="sm"
                                    disabled={loadingAction === "reset"}
                                    className="w-full flex items-center gap-2"
                                >
                                    <RefreshCcw
                                        className={cn(
                                            "h-4 w-4",
                                            loadingAction === "reset" && "animate-spin"
                                        )}
                                    />
                                    Apply Reset Rules Now
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    );
}
