"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Filter,
    Pencil,
    Save,
    X,
    Download,
    ChevronDown,
    ChevronUp,
    Trash2,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Transaction {
    id: number;
    user_id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string; // YYYY-MM-DD
}

interface Category {
    id: number;
    name: string;
    color: string;
}

type SortKey = "title" | "category" | "date" | "type" | "amount";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

export default function AllTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    // Inline Editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<Transaction>>({});
    const firstEditInputRef = useRef<HTMLInputElement | null>(null);

    // === Initial Fetch ===
    useEffect(() => {
        (async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: firstTx, error: txErr, count } = await supabase
                .from("transactions")
                .select("*", { count: "exact" })
                .eq("user_id", user.id)
                .order("date", { ascending: false })
                .range(0, PAGE_SIZE - 1);

            if (txErr) console.error(txErr);

            const { data: catData, error: catErr } = await supabase
                .from("categories")
                .select("id,name,color")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (catErr) console.error(catErr);

            setTransactions(firstTx || []);
            setCategories(catData || []);
            setOffset(firstTx?.length || 0);
            setHasMore((firstTx?.length || 0) < (count || 0));
            setLoading(false);
        })();

        // === Realtime Sync ===
        const channel = supabase
            .channel("transactions-all-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "transactions" },
                (payload) => {
                    const newTx = payload.new as Transaction;
                    const oldTx = payload.old as Transaction;
                    if (payload.eventType === "INSERT") setTransactions((p) => [newTx, ...p]);
                    if (payload.eventType === "UPDATE")
                        setTransactions((p) => p.map((t) => (t.id === newTx.id ? newTx : t)));
                    if (payload.eventType === "DELETE")
                        setTransactions((p) => p.filter((t) => t.id !== oldTx.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // === Load More (Pagination) ===
    const handleLoadMore = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;
        const from = offset;
        const to = offset + PAGE_SIZE - 1;

        const { data: more, error, count } = await supabase
            .from("transactions")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .range(from, to);

        if (error) {
            console.error(error);
            return toast.error("Error while loading more data.");
        }

        setTransactions((prev) => [...prev, ...(more || [])]);
        const added = more?.length || 0;
        setOffset((prev) => prev + added);
        setHasMore(offset + added < (count || 0));
    };

    // === Filtering ===
    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const q = search.toLowerCase();
            const matchSearch =
                t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
            const matchType = filterType === "all" || t.type === filterType;
            const matchCategory = filterCategory === "all" || t.category === filterCategory;
            return matchSearch && matchType && matchCategory;
        });
    }, [transactions, search, filterType, filterCategory]);

    // === Sorting ===
    const sorted = useMemo(() => {
        const arr = [...filtered];
        arr.sort((a, b) => {
            let va: any = a[sortKey];
            let vb: any = b[sortKey];
            if (sortKey === "title" || sortKey === "category" || sortKey === "type") {
                va = String(va).toLowerCase();
                vb = String(vb).toLowerCase();
            } else if (sortKey === "amount") {
                va = Number(va);
                vb = Number(vb);
            } else if (sortKey === "date") {
                va = new Date(a.date).getTime();
                vb = new Date(b.date).getTime();
            }
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
        return arr;
    }, [filtered, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    // === Inline Editing ===
    const startEdit = (t: Transaction) => {
        setEditingId(t.id);
        setEditDraft({ ...t });
        setTimeout(() => firstEditInputRef.current?.focus(), 0);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft({});
    };

    const saveEdit = async () => {
        if (editingId == null) return;
        const draft = editDraft as Transaction;
        if (!draft.title?.trim()) return toast.error("Title is required.");
        const amt = Math.abs(Number(draft.amount));
        if (!Number.isFinite(amt) || amt <= 0) return toast.error("Amount must be greater than 0.");

        const { error } = await supabase
            .from("transactions")
            .update({
                title: draft.title.trim(),
                amount: amt,
                type: draft.type,
                category: draft.category,
                date: draft.date,
            })
            .eq("id", editingId);

        if (error) {
            console.error(error);
            return toast.error("Error while saving changes.");
        }

        setTransactions((prev) =>
            prev.map((t) => (t.id === editingId ? { ...draft, amount: amt } : t))
        );
        toast.success("Transaction updated.");
        cancelEdit();
    };

    const deleteTx = async (id: number) => {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) {
            console.error(error);
            toast.error("Error while deleting transaction.");
        } else {
            toast.success("Transaction deleted.");
        }
    };

    // === CSV Export ===
    const exportCSV = () => {
        const rows = sorted;
        const header = ["Title", "Category", "Date", "Type", "Amount (€)"];
        const csv = [header, ...rows.map((t) => [t.title, t.category, t.date, t.type, t.amount.toFixed(2)])]
            .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `neospend-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // === UI ===
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/transactions">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">All Transactions</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        {cat.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[220px]"
                    />

                    <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </header>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-sm text-muted-foreground py-4">Loading ...</p>
                    ) : sorted.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            No transactions found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    {(
                                        [
                                            { key: "title", label: "Title" },
                                            { key: "category", label: "Category" },
                                            { key: "date", label: "Date" },
                                            { key: "type", label: "Type" },
                                            { key: "amount", label: "Amount" },
                                            { key: "actions", label: "" },
                                        ] as { key: SortKey | "actions"; label: string }[]
                                    ).map((col) => (
                                        <th
                                            key={col.key as string}
                                            className={`py-3 px-2 ${
                                                col.key !== "actions"
                                                    ? "cursor-pointer select-none"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                col.key !== "actions" &&
                                                toggleSort(col.key as SortKey)
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                <span className="text-left">{col.label}</span>
                                                {sortKey === col.key &&
                                                    (sortDir === "asc" ? (
                                                        <ChevronUp className="h-3 w-3" />
                                                    ) : (
                                                        <ChevronDown className="h-3 w-3" />
                                                    ))}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {sorted.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b border-border hover:bg-muted/40"
                                    >
                                        {/* Title */}
                                        <td className="py-3 px-2 font-medium">
                                            {editingId === t.id ? (
                                                <Input
                                                    ref={firstEditInputRef}
                                                    value={(editDraft.title as string) ?? ""}
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            title: e.target.value,
                                                        }))
                                                    }
                                                    className="h-8"
                                                />
                                            ) : (
                                                t.title
                                            )}
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-2">
                                            {editingId === t.id ? (
                                                <select
                                                    value={(editDraft.category as string) ?? ""}
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            category: e.target.value,
                                                        }))
                                                    }
                                                    className="h-8 rounded-md border bg-background px-2"
                                                >
                                                    {categories.map((c) => (
                                                        <option key={c.id} value={c.name}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                        <span
                                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    categories.find(
                                                                        (c) => c.name === t.category
                                                                    )?.color || "#999",
                                                            }}
                                                        />
                                                    {t.category}
                                                </div>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 px-2 text-muted-foreground">
                                            {editingId === t.id ? (
                                                <Input
                                                    type="date"
                                                    value={(editDraft.date as string) ?? ""}
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            date: e.target.value,
                                                        }))
                                                    }
                                                    className="h-8"
                                                />
                                            ) : (
                                                t.date
                                            )}
                                        </td>

                                        {/* Type */}
                                        <td className="py-3 px-2">
                                            {editingId === t.id ? (
                                                <select
                                                    value={(editDraft.type as string) ?? ""}
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            type: e.target
                                                                .value as Transaction["type"],
                                                        }))
                                                    }
                                                    className="h-8 rounded-md border bg-background px-2"
                                                >
                                                    <option value="income">Income</option>
                                                    <option value="expense">Expense</option>
                                                </select>
                                            ) : (
                                                <Badge
                                                    variant={
                                                        t.type === "income"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                    className="text-xs flex items-center gap-1"
                                                >
                                                    {t.type === "income" ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {t.type === "income"
                                                        ? "Income"
                                                        : "Expense"}
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td
                                            className={`py-3 px-2 text-right font-semibold ${
                                                t.type === "expense"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {editingId === t.id ? (
                                                <Input
                                                    type="number"
                                                    value={String(editDraft.amount ?? 0)}
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            amount:
                                                                Math.abs(
                                                                    parseFloat(e.target.value)
                                                                ) || 0,
                                                        }))
                                                    }
                                                    className="h-8 text-right"
                                                />
                                            ) : (
                                                <span>
                                                        {t.type === "expense" ? "−" : "+"}{" "}
                                                    {t.amount.toFixed(2)} €
                                                    </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-2">
                                            {editingId === t.id ? (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={saveEdit}
                                                        aria-label="Save"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={cancelEdit}
                                                        aria-label="Cancel"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => startEdit(t)}
                                                        aria-label="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => deleteTx(t.id)}
                                                        aria-label="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {hasMore && (
                        <div className="pt-4 flex justify-center">
                            <Button onClick={handleLoadMore}>Load more</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Footer */}
            <div className="text-center">
                <Link href="/transactions">
                    <Button variant="outline">Back to Overview</Button>
                </Link>
            </div>
        </motion.div>
    );
}