"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

type Category = { id: string; name: string };

export default function CreateBudget({
                                         categories,
                                         blockedCategoryNames = [],
                                         onCreate,
                                     }: {
    categories: Category[];
    blockedCategoryNames?: string[]; // Kategorienamen mit bereits vorhandenem Budget
    onCreate: (payload: { categoryName: string; limit: number }) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [categoryName, setCategoryName] = React.useState<string>("");
    const [limit, setLimit] = React.useState<number>(100);

    const available = React.useMemo(
        () => categories.filter((c) => !blockedCategoryNames.includes(c.name)),
        [categories, blockedCategoryNames]
    );

    function submit() {
        if (!categoryName) return;
        onCreate({ categoryName, limit: Math.max(0, Number(limit)) });
        setOpen(false);
        setCategoryName("");
        setLimit(100);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> New budget
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create budget</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3">
                    <Label htmlFor="budget-category">Category</Label>
                    <select
                        id="budget-category"
                        className="border bg-background rounded-md h-9 px-3"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a category…
                        </option>
                        {available.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <Label htmlFor="budget-limit">Monthly limit (€)</Label>
                    <Input id="budget-limit" inputMode="decimal" value={String(limit)} onChange={(e) => setLimit(Number(e.target.value))} />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submit} disabled={!categoryName}>
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
