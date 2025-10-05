"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-24 px-6 text-center md:text-left max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10"
        >
            {/* Text */}
            <div className="flex-1 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Take control of your finances with <span className="text-primary">NeoSpend</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg">
                    Manage your money smarter with real-time insights, smart budgeting, and powerful analytics.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                    <Button asChild size="lg">
                        <Link href="/login">Get Started Free</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/features">Learn More</Link>
                    </Button>
                </div>
            </div>

            {/* Image / Illustration */}
            <motion.img
                src="/illustrations/dashboard-preview.png"
                alt="NeoSpend dashboard preview"
                className="w-full max-w-md rounded-xl shadow-xl border border-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            />
        </motion.section>
    );
}