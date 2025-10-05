'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { SectionHeading } from '@/components/section-heading';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type Post = {
    title: string;
    desc: string;
    date: string;
    slug: string;
    tags: string[];
    category: 'Product' | 'Tips' | 'Updates';
};

const posts: Post[] = [
    {
        title: 'Introducing NeoSpend',
        desc: 'How we’re redefining personal finance tracking with smart automation and AI insights.',
        date: 'October 5, 2025',
        slug: 'introducing-neospend',
        tags: ['Product', 'Launch', 'AI'],
        category: 'Product',
    },
    {
        title: 'Saving smarter: 5 tips to boost your budget',
        desc: 'Discover practical strategies to make your money last longer every month.',
        date: 'September 21, 2025',
        slug: 'budget-tips',
        tags: ['Tips', 'Finance'],
        category: 'Tips',
    },
    {
        title: 'New Dashboard Insights — Version 1.2',
        desc: 'We’ve redesigned the analytics panel for clarity and speed. Here’s what’s new.',
        date: 'September 14, 2025',
        slug: 'dashboard-insights-v12',
        tags: ['Updates', 'UI/UX'],
        category: 'Updates',
    },
    {
        title: 'How Supabase powers NeoSpend',
        desc: 'A technical look into how we built our backend for scalability and speed.',
        date: 'August 10, 2025',
        slug: 'supabase-integration',
        tags: ['Tech', 'Supabase'],
        category: 'Product',
    },
    {
        title: 'Mastering UI/UX Consistency',
        desc: 'Five small design principles that elevate your app’s usability instantly.',
        date: 'July 2, 2025',
        slug: 'uiux-consistency',
        tags: ['Design', 'UI/UX'],
        category: 'Tips',
    },
];

export default function BlogPage() {
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 6;

    // 🔍 Filtered Posts
    const filteredPosts = useMemo(() => {
        const query = search.toLowerCase();

        return posts
            .filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.desc.toLowerCase().includes(query)
            )
            .filter((p) => (activeTag ? p.tags.includes(activeTag) : true));
    }, [search, activeTag]);

    // 📄 Pagination
    const totalPages = Math.ceil(filteredPosts.length / perPage);
    const displayedPosts = filteredPosts.slice(
        (page - 1) * perPage,
        page * perPage
    );

    // ✨ Alle Tags sammeln & alphabetisch sortieren
    const allTags = useMemo(() => {
        const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort((a, b) =>
            a.localeCompare(b)
        );

        if (activeTag) {
            // aktiver Tag zuerst
            return [activeTag, ...tags.filter((t) => t !== activeTag)];
        }
        return tags;
    }, [posts, activeTag]);

    return (
        <section className="container mx-auto px-4 py-16">
            <SectionHeading>Blog</SectionHeading>

            {/* 🔍 Search Input */}
            <div className="max-w-md mx-auto mb-6 relative">
                <Input
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="h-10 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            {/* 🧭 Tag Filter mit Dropdown */}
            <div className="flex justify-center mb-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                            {activeTag ? (
                                <Badge variant="secondary" className="px-2 py-0.5">
                                    {activeTag}
                                </Badge>
                            ) : null}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="center" className="w-44">
                        <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {allTags.map((tag) => (
                            <DropdownMenuItem
                                key={tag}
                                onClick={() => {
                                    setActiveTag(activeTag === tag ? null : tag);
                                    setPage(1);
                                }}
                                className={activeTag === tag ? 'bg-muted text-foreground' : ''}
                            >
                                {tag}
                            </DropdownMenuItem>
                        ))}
                        {activeTag && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setActiveTag(null)}
                                    className="text-muted-foreground"
                                >
                                    Clear filter
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 📚 Tabs for categories */}
            <Tabs defaultValue="All" className="w-full">
                <TabsList className="flex justify-center flex-wrap gap-2 mb-8">
                    {['All', 'Product', 'Tips', 'Updates'].map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="capitalize">
                            {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {['All', 'Product', 'Tips', 'Updates'].map((cat) => (
                    <TabsContent key={cat} value={cat}>
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.4 }}
                                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {displayedPosts
                                    .filter((p) => cat === 'All' || p.category === cat)
                                    .map((post) => (
                                        <motion.div
                                            key={post.slug}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                        >
                                            <Card className="border-border hover:border-primary/70 transition">
                                                <CardHeader>
                                                    <CardTitle>{post.title}</CardTitle>
                                                    <CardDescription>{post.date}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-muted-foreground mb-4 line-clamp-3">
                                                        {post.desc}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Button asChild size="sm">
                                                        <Link href={`/blog/${post.slug}`}>Read more →</Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}

                                {/* 🫥 Keine Ergebnisse */}
                                {displayedPosts.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-muted-foreground">
                                        No articles found for your search.
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </TabsContent>
                ))}
            </Tabs>

            {/* 📄 Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </section>
    );
}