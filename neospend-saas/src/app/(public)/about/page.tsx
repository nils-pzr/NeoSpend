'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Zap, ShieldCheck } from 'lucide-react';
import Link from "next/link";

export default function AboutPage() {
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
                    <h1 className="text-4xl font-bold mb-4">About NeoSpend</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        NeoSpend was founded with one goal — to make money management intuitive,
                        data-driven, and beautiful. We believe finance apps should empower, not overwhelm.
                    </p>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground mb-6">
                        We aim to redefine how individuals understand their finances — through transparency,
                        automation, and smart technology. With NeoSpend, financial awareness becomes effortless and empowering.
                    </p>
                    <Button size="lg">Join the Movement</Button>
                </motion.div>

                <motion.img
                    src="/about-illustration.png"
                    alt="About NeoSpend illustration"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-xl shadow-lg border border-border"
                />
            </section>

            {/* Core Values */}
            <section className="bg-muted/30 py-20">
                <div className="container mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: <Users className="h-8 w-8 text-primary" />,
                            title: 'User First',
                            desc: 'Every design choice and feature is built around real people and real experiences.',
                        },
                        {
                            icon: <Zap className="h-8 w-8 text-primary" />,
                            title: 'Innovation Driven',
                            desc: 'We continuously experiment and iterate to make financial management smarter and faster.',
                        },
                        {
                            icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                            title: 'Privacy by Default',
                            desc: 'Your financial data stays yours. Security and transparency are built into every layer.',
                        },
                    ].map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full bg-card/60 backdrop-blur-md border-border hover:shadow-lg transition">
                                <CardHeader className="text-center">
                                    <div className="flex justify-center mb-3">{v.icon}</div>
                                    <CardTitle>{v.title}</CardTitle>
                                    <CardDescription>{v.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-20 bg-gradient-to-t from-primary/10 to-transparent">
                <h2 className="text-3xl font-semibold mb-4">We’re Just Getting Started</h2>
                <p className="text-muted-foreground mb-6">
                    NeoSpend is growing fast. Be part of a smarter financial future today.
                </p>
                <Button asChild size="lg">
                    <Link href="/pricing">Get Started</Link>
                </Button>
            </section>
        </div>
    );
}