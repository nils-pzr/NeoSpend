"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ListOrdered,
    Plus,
    Pencil,
    Trash2,
    FolderOpen,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
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
import { toast } from "sonner";

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
    user_id: string;
    name: string;
    color: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [category, setCategory] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#7546E8");
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    // 📦 Fetch transactions & categories
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: txData } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false })
                .limit(10);

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
            .channel("transactions-realtime")
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

    // ➕ Kategorie hinzufügen
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return toast.error("Bitte Kategorienamen angeben.");
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return toast.error("Bitte einloggen.");

        const { data, error } = await supabase
            .from("categories")
            .insert([{ user_id: user.id, name: newCategoryName.trim(), color: newCategoryColor }])
            .select();

        if (error) {
            console.error(error);
            toast.error("Fehler beim Erstellen der Kategorie.");
        } else if (data?.length) {
            setCategories((prev) => [...prev, data[0]]);
            setCategory(data[0].name);
            setNewCategoryName("");
            toast.success("Kategorie erstellt.");
        }
    };

    // ➕ Transaktion hinzufügen
    const handleAddTransaction = async () => {
        const parsedAmount = Number.parseFloat(amount);
        if (!title.trim()) return toast.error("Titel ist erforderlich.");
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0)
            return toast.error("Betrag muss > 0 sein.");
        if (!type) return toast.error("Typ wählen.");

        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return toast.error("Bitte einloggen.");

        const { error } = await supabase.from("transactions").insert([
            {
                user_id: user.id,
                title: title.trim(),
                amount: Math.abs(parsedAmount),
                type,
                category: category || "Allgemein",
                date: new Date().toISOString().split("T")[0],
            },
        ]);

        if (error) {
            console.error(error);
            toast.error("Fehler beim Speichern.");
        } else {
            setTitle("");
            setAmount("");
            setCategory("");
            setOpenAddDialog(false);
            toast.success("Transaktion gespeichert.");
        }
    };

    // ✏️ Transaktion bearbeiten
    const handleEditTransaction = async () => {
        if (!editingTransaction) return;
        const parsedAmount = Math.abs(Number(editingTransaction.amount));
        if (!editingTransaction.title.trim()) return toast.error("Titel ist erforderlich.");
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0)
            return toast.error("Betrag muss > 0 sein.");

        const { error } = await supabase
            .from("transactions")
            .update({
                title: editingTransaction.title.trim(),
                amount: parsedAmount,
                type: editingTransaction.type,
                category: editingTransaction.category,
            })
            .eq("id", editingTransaction.id);

        if (error) {
            console.error(error);
            toast.error("Fehler beim Aktualisieren.");
        } else {
            setEditingTransaction(null);
            toast.success("Transaktion aktualisiert.");
        }
    };

    // 🗑️ Transaktion löschen
    const handleDeleteTransaction = async (id: number) => {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) {
            console.error(error);
            toast.error("Fehler beim Löschen.");
        } else {
            toast.success("Transaktion gelöscht.");
        }
    };

    const lastFive = useMemo(() => transactions.slice(0, 5), [transactions]);

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

                {/* Kategorien */}
                <div className="flex items-center gap-2">
                    <Link href="/categories">
                        <Button variant="outline" className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            Kategorien verwalten
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Card mit Transaktionen */}
            <Card>
                <CardHeader>
                    <CardTitle>Letzte Transaktionen</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Lädt ...</p>
                    ) : transactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Noch keine Transaktionen vorhanden.
                        </p>
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {lastFive.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        {t.type === "income" ? (
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-500" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">
                                                {t.title}
                                            </span>
                                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                                                <span
                                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            categories.find(
                                                                (c) => c.name === t.category
                                                            )?.color || "#999",
                                                    }}
                                                />
                                                {t.category} • {t.date}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`font-semibold ${
                                                t.type === "expense"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {t.type === "expense" ? "−" : "+"}{" "}
                                            {t.amount.toFixed(2)} €
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

                    <Link href="/transactions/all">
                        <Button variant="secondary" className="w-full">
                            Alle Transaktionen anzeigen
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Floating Action Button */}
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogTrigger asChild>
                    <button
                        aria-label="Add Transaction"
                        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Neue Transaktion hinzufügen</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Titel */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Titel</Label>
                            <Input
                                id="title"
                                placeholder="z. B. Einkauf bei Rewe"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                            />
                        </div>

                        {/* Betrag */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Betrag</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="z. B. 49.99"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                            />
                        </div>

                        {/* Typ */}
                        <div className="space-y-2">
                            <Label>Typ</Label>
                            <Select
                                value={type}
                                onValueChange={(val: "income" | "expense") => setType(val)}
                            >
                                <SelectTrigger className="focus:outline-none focus-visible:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                                    <SelectValue placeholder="Typ wählen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Einnahme</SelectItem>
                                    <SelectItem value="expense">Ausgabe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Kategorie */}
                        <div className="space-y-2">
                            <Label>Kategorie</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="focus:outline-none focus-visible:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                                    <SelectValue placeholder="Kategorie wählen" />
                                </SelectTrigger>
                                <SelectContent>
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
                                    <Separator className="my-2" />
                                    <div className="p-2 space-y-2">
                                        <Label htmlFor="new-cat">+ Neue Kategorie</Label>
                                        <Input
                                            id="new-cat"
                                            placeholder="Name der Kategorie"
                                            value={newCategoryName}
                                            onChange={(e) =>
                                                setNewCategoryName(e.target.value)
                                            }
                                            className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Label>Farbe:</Label>
                                            <Input
                                                type="color"
                                                value={newCategoryColor}
                                                onChange={(e) =>
                                                    setNewCategoryColor(e.target.value)
                                                }
                                                className="w-10 h-8 p-0 border-none cursor-pointer"
                                            />
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={handleAddCategory}
                                            >
                                                Hinzufügen
                                            </Button>
                                        </div>
                                    </div>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full mt-3" onClick={handleAddTransaction}>
                            Speichern
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            title: e.target.value,
                                        })
                                    }
                                    className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
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
                                            amount:
                                                Math.abs(parseFloat(e.target.value)) || 0,
                                        })
                                    }
                                    className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Typ</Label>
                                <Select
                                    value={editingTransaction.type}
                                    onValueChange={(val: "income" | "expense") =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            type: val,
                                        })
                                    }
                                >
                                    <SelectTrigger className="focus:outline-none focus-visible:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                                        <SelectValue placeholder="Typ wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Einnahme</SelectItem>
                                        <SelectItem value="expense">Ausgabe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kategorie</Label>
                                <Select
                                    value={editingTransaction.category}
                                    onValueChange={(val) =>
                                        setEditingTransaction({
                                            ...editingTransaction,
                                            category: val,
                                        })
                                    }
                                >
                                    <SelectTrigger className="focus:outline-none focus-visible:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                                        <SelectValue placeholder="Kategorie wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
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