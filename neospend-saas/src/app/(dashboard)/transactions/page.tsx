"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListOrdered, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Transaction {
    id: number;
    user_id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [category, setCategory] = useState("Allgemein");
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // 📦 Fetch transactions (nur eigene)
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false });

            if (error) console.error(error);
            else setTransactions(data || []);
            setLoading(false);
        };

        fetchTransactions();

        // 🔄 Realtime Subscription
        const channel = supabase
            .channel("transactions-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "transactions" },
                (payload) => {
                    const newTx = payload.new as Transaction;
                    const oldTx = payload.old as Transaction;

                    if (payload.eventType === "INSERT") {
                        setTransactions((prev) => [newTx, ...prev]);
                    } else if (payload.eventType === "UPDATE") {
                        setTransactions((prev) =>
                            prev.map((t) => (t.id === newTx.id ? newTx : t))
                        );
                    } else if (payload.eventType === "DELETE") {
                        setTransactions((prev) => prev.filter((t) => t.id !== oldTx.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // ➕ Add Transaction
    const handleAddTransaction = async () => {
        if (!title || !amount) return;

        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
            alert("Bitte einloggen, um Transaktionen hinzuzufügen.");
            return;
        }

        const parsedAmount = Math.abs(parseFloat(amount));

        const { error } = await supabase.from("transactions").insert([
            {
                user_id: user.id,
                title,
                amount: parsedAmount,
                type,
                category,
                date: new Date().toISOString().split("T")[0],
            },
        ]);

        if (error) {
            console.error(error);
            alert("Fehler beim Speichern.");
        } else {
            setTitle("");
            setAmount("");
            setCategory("Allgemein");
        }
    };

    // ✏️ Edit Transaction
    const handleEditTransaction = async () => {
        if (!editingTransaction) return;

        const parsedAmount = Math.abs(parseFloat(editingTransaction.amount.toString()));

        const { error } = await supabase
            .from("transactions")
            .update({
                title: editingTransaction.title,
                amount: parsedAmount,
                type: editingTransaction.type,
                category: editingTransaction.category,
            })
            .eq("id", editingTransaction.id);

        if (error) {
            console.error(error);
            alert("Fehler beim Aktualisieren.");
        } else {
            setEditingTransaction(null);
        }
    };

    // 🗑️ Delete Transaction
    const handleDeleteTransaction = async (id: number) => {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) {
            console.error(error);
            alert("Fehler beim Löschen.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <header className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <ListOrdered className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Transactions</h1>
                        <p className="text-muted-foreground">
                            Überblick über deine Einnahmen und Ausgaben.
                        </p>
                    </div>
                </div>

                {/* Add Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Transaction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Neue Transaktion hinzufügen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titel</Label>
                                <Input
                                    id="title"
                                    placeholder="z. B. Einkauf bei Rewe"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Betrag</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="z. B. 49.99"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Typ</Label>
                                <Select
                                    value={type}
                                    onValueChange={(val: "income" | "expense") => setType(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Typ wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Einnahme</SelectItem>
                                        <SelectItem value="expense">Ausgabe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full mt-3" onClick={handleAddTransaction}>
                                Speichern
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            {/* Card mit Transaktionen */}
            <Card>
                <CardHeader>
                    <CardTitle>Letzte Transaktionen</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Lädt ...
                        </p>
                    ) : transactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Noch keine Transaktionen vorhanden.
                        </p>
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {transactions.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{t.title}</span>
                                        <span className="text-muted-foreground text-xs">{t.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                    <span
                        className={`font-semibold ${
                            t.type === "expense" ? "text-red-500" : "text-green-500"
                        }`}
                    >
                      {t.type === "expense" ? "−" : "+"} {t.amount.toFixed(2)} €
                    </span>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setEditingTransaction(t)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteTransaction(t.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Separator className="my-4" />

                    <Button variant="secondary" className="w-full">
                        Alle Transaktionen anzeigen
                    </Button>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Transaktion bearbeiten</DialogTitle>
                    </DialogHeader>
                    {editingTransaction && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Titel</Label>
                                <Input
                                    id="edit-title"
                                    value={editingTransaction.title}
                                    onChange={(e) =>
                                        setEditingTransaction({ ...editingTransaction, title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-amount">Betrag</Label>
                                <Input
                                    id="edit-amount"
                                    type="number"
                                    value={editingTransaction.amount}
                                    onChange={(e) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            amount: Math.abs(parseFloat(e.target.value)) || 0,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Typ</Label>
                                <Select
                                    value={editingTransaction.type}
                                    onValueChange={(val: "income" | "expense") =>
                                        setEditingTransaction({ ...editingTransaction, type: val })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Typ wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Einnahme</SelectItem>
                                        <SelectItem value="expense">Ausgabe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleEditTransaction}>Speichern</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}