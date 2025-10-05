'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Coins,
    BarChart3,
    Brain,
    Shield,
    RefreshCcw,
    Cloud,
} from 'lucide-react';

const features = [
    {
        icon: <Coins className="h-8 w-8 text-primary" />,
        title: 'Smart Expense Tracking',
        desc: 'Automatically capture and categorize your spending through bank connections or CSV imports.',
    },
    {
        icon: <BarChart3 className="h-8 w-8 text-primary" />,
        title: 'Live Analytics Dashboard',
        desc: 'Get real-time visual insights into your income, spending trends, and budget performance.',
    },
    {
        icon: <Brain className="h-8 w-8 text-primary" />,
        title: 'AI-Powered Insights',
        desc: 'Our intelligent analysis detects patterns and provides personalized money-saving suggestions.',
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'Data Security',
        desc: 'End-to-end encryption ensures your data always stays private and protected.',
    },
    {
        icon: <Cloud className="h-8 w-8 text-primary" />,
        title: 'Cloud Sync',
        desc: 'Access your finances anywhere — fully synced and secured across all your devices.',
    },
    {
        icon: <RefreshCcw className="h-8 w-8 text-primary" />,
        title: 'Automatic Backups',
        desc: 'Daily cloud backups keep your financial data safe — no risks, no worries.',
    },
];

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary/10 to-transparent py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-6"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Powerful Features to Redefine Your Finances
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        NeoSpend combines design, analytics, and technology to give you full
                        control over your financial life.
                    </p>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full bg-card/60 backdrop-blur-md border-border hover:shadow-lg transition">
                                <CardHeader className="text-center">
                                    <div className="flex justify-center mb-3">{f.icon}</div>
                                    <CardTitle>{f.title}</CardTitle>
                                    <CardDescription>{f.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Highlight Section */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-6 grid gap-10 lg:grid-cols-2 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Everything at a Glance</h2>
                        <p className="text-muted-foreground mb-6">
                            Your personalized dashboard displays your finances like never before.
                            Identify spending patterns, plan smarter, and stay informed with
                            real-time analytics and clean visualization.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/pricing">Get Started for Free</Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <img
                            src="/illustrations/dashboard-preview.jpg"
                            alt="NeoSpend Dashboard Preview"
                            className="rounded-2xl shadow-lg border border-border"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container mx-auto px-6 py-20 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-semibold mb-12"
                >
                    What Our Users Say
                </motion.h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            name: 'Lara M.',
                            text: '“Finally, I understand where my money goes. NeoSpend is intuitive and beautifully designed.”',
                        },
                        {
                            name: 'Jonas R.',
                            text: '“I use NeoSpend every day. The budget alerts are a lifesaver — no more overdrafts!”',
                        },
                        {
                            name: 'Sophie T.',
                            text: '“Simple, modern, and reliable — NeoSpend has completely changed how I manage my finances.”',
                        },
                    ].map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * i }}
                        >
                            <Card className="bg-card/60 backdrop-blur border-border p-6">
                                <CardContent>
                                    <p className="italic text-muted-foreground mb-4">{t.text}</p>
                                    <p className="font-semibold">{t.name}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-20 bg-gradient-to-t from-primary/10 to-transparent">
                <h2 className="text-3xl font-semibold mb-4">
                    Ready to Master Your Finances?
                </h2>
                <p className="text-muted-foreground mb-6">
                    Start free today and experience effortless money management.
                </p>
                <Button asChild size="lg">
                    <Link href="/pricing">Get Started</Link>
                </Button>
            </section>
        </div>
    );
}