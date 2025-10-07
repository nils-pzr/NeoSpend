"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FolderPlus, Plus, Pencil, Trash2 } from "lucide-react";
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

interface Category {
    id: number;
    user_id: string;
    name: string;
    color: string;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#7546E8");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // 📦 Fetch categories
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return;

            const { data } = await supabase
                .from("categories")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            setCategories(data || []);
            setLoading(false);
        };

        fetchData();

        // 🔄 Realtime updates
        const channel = supabase
            .channel("categories-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "categories" },
                (payload) => {
                    const newCat = payload.new as Category;
                    const oldCat = payload.old as Category;
                    if (payload.eventType === "INSERT")
                        setCategories((prev) => [...prev, newCat]);
                    if (payload.eventType === "UPDATE")
                        setCategories((prev) =>
                            prev.map((c) => (c.id === newCat.id ? newCat : c))
                        );
                    if (payload.eventType === "DELETE")
                        setCategories((prev) => prev.filter((c) => c.id !== oldCat.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // ➕ Add new category (with instant UI refresh)
    const handleAddCategory = async () => {
        if (!newName.trim()) return;
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
            .from("categories")
            .insert([{ user_id: user.id, name: newName.trim(), color: newColor }])
            .select();

        if (error) {
            console.error(error);
            alert("Error while creating category.");
        } else if (data?.length) {
            // ⚡ Instant UI update
            setCategories((prev) => [...prev, data[0]]);
            setNewName("");
            setNewColor("#7546E8");
        }
    };

    // ✏️ Edit category (with instant refresh)
    const handleEditCategory = async () => {
        if (!editingCategory) return;

        const updatedCategory = { ...editingCategory };

        // ⚡ Optimistic UI update
        setCategories((prev) =>
            prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
        );

        const { error } = await supabase
            .from("categories")
            .update({
                name: updatedCategory.name,
                color: updatedCategory.color,
            })
            .eq("id", updatedCategory.id);

        if (error) {
            console.error(error);
            alert("Error while updating category.");
        }

        setEditingCategory(null);
    };

    // 🗑️ Delete category (with instant refresh)
    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        // ⚡ Optimistic UI update
        setCategories((prev) => prev.filter((c) => c.id !== id));

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            console.error(error);
            alert("Error while deleting category.");
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
                    <FolderPlus className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Categories</h1>
                        <p className="text-muted-foreground">
                            Manage your personal spending categories.
                        </p>
                    </div>
                </div>

                {/* Add Category Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">Name</Label>
                                <Input
                                    id="new-name"
                                    placeholder="e.g. Groceries"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-12 h-10 p-0 border-none cursor-pointer focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                />
                            </div>
                            <Button className="w-full" onClick={handleAddCategory}>
                                Create
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            {/* Categories List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Loading ...
                        </p>
                    ) : categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No categories yet.
                        </p>
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between py-3 text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="font-medium text-foreground">{cat.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setEditingCategory(cat)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={editingCategory.name}
                                    onChange={(e) =>
                                        setEditingCategory({
                                            ...editingCategory,
                                            name: e.target.value,
                                        })
                                    }
                                    className="focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Input
                                    type="color"
                                    value={editingCategory.color}
                                    onChange={(e) =>
                                        setEditingCategory({
                                            ...editingCategory,
                                            color: e.target.value,
                                        })
                                    }
                                    className="w-12 h-10 p-0 border-none cursor-pointer focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleEditCategory}>Save</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}