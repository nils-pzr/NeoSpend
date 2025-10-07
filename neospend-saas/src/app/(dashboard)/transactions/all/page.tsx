"use client";

import { useEffect, useState, useMemo } from "react";
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
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

interface Transaction {
    id: number;
    user_id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
}

export default function AllTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    // 📦 Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data: txData } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false });

            const { data: catData } = await supabase
                .from("categories")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            setTransactions(txData || []);
            setCategories(catData || []);
            setLoading(false);
        };

        fetchData();

        // 🔄 Realtime updates
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

    // 🔍 Filtering
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            const matchSearch =
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.category.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === "all" || t.type === filterType;
            const matchCategory = filterCategory === "all" || t.category === filterCategory;
            return matchSearch && matchType && matchCategory;
        });
    }, [transactions, search, filterType, filterCategory]);

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
                        <Select value={filterType} onValueChange={(val: any) => setFilterType(val)}>
                            <SelectTrigger className="w-[130px] focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]">
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
                        <SelectTrigger className="w-[150px] focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]">
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
                        className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)] w-[200px]"
                    />
                </div>
            </header>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-sm text-muted-foreground py-4">Loading ...</p>
                    ) : filteredTransactions.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            No transactions found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="text-left py-3 px-2">Title</th>
                                    <th className="text-left py-3 px-2">Category</th>
                                    <th className="text-left py-3 px-2">Date</th>
                                    <th className="text-left py-3 px-2">Type</th>
                                    <th className="text-right py-3 px-2">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-border hover:bg-muted/40">
                                        <td className="py-3 px-2 font-medium">{t.title}</td>
                                        <td className="py-3 px-2 flex items-center gap-2">
                        <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{
                                backgroundColor:
                                    categories.find((c) => c.name === t.category)?.color || "#999",
                            }}
                        />
                                            {t.category}
                                        </td>
                                        <td className="py-3 px-2 text-muted-foreground">{t.date}</td>
                                        <td className="py-3 px-2">
                                            <Badge
                                                variant={t.type === "income" ? "default" : "destructive"}
                                                className="text-xs"
                                            >
                                                {t.type === "income" ? "Income" : "Expense"}
                                            </Badge>
                                        </td>
                                        <td
                                            className={`py-3 px-2 text-right font-semibold ${
                                                t.type === "expense" ? "text-red-500" : "text-green-500"
                                            }`}
                                        >
                                            {t.type === "expense" ? "−" : "+"} {t.amount.toFixed(2)} €
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator className="my-8" />

            <div className="text-center">
                <Link href="/transactions">
                    <Button variant="outline">Back to Overview</Button>
                </Link>
            </div>
        </motion.div>
    );
}