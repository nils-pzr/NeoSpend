"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="not-prose font-sans text-[0.875rem] leading-normal text-muted-foreground">
            {/* Main Footer Section */}
            <div className="max-w-[1200px] mx-auto px-6 py-20 grid items-start gap-y-12 gap-x-12 sm:grid-cols-2 lg:grid-cols-[2.8fr_1fr_1fr_1fr]">
                {/* Branding + Newsletter + Socials */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Smarter finance starts here 💸
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-sm mt-3">
                                NeoSpend helps you understand and control your money — effortlessly.
                            </p>
                        </div>

                        {/* Newsletter Form */}
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex w-full max-w-sm items-center gap-2 mt-6"
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-10 bg-background border-border text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                                required
                            />
                            <Button
                                type="submit"
                                className="h-10 px-4 bg-primary text-primary-foreground hover:opacity-90"
                            >
                                Stay updated
                            </Button>
                        </form>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center mt-8 gap-[0.3rem]">
                        <Button
                            asChild
                            size="icon"
                            variant="outline"
                            className="rounded-full hover:bg-primary/10"
                        >
                            <Link href="mailto:business.nilspzr@gmail.com" aria-label="Mail">
                                <Mail className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="icon"
                            variant="outline"
                            className="rounded-full hover:bg-primary/10"
                        >
                            <Link
                                href="https://linkedin.com/in/nils-pzr"
                                target="_blank"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="icon"
                            variant="outline"
                            className="rounded-full hover:bg-primary/10"
                        >
                            <Link
                                href="https://github.com/nils-pzr"
                                target="_blank"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="icon"
                            variant="outline"
                            className="rounded-full hover:bg-primary/10"
                        >
                            <Link
                                href="https://nils-pzr.eu"
                                target="_blank"
                                aria-label="Website"
                            >
                                <Globe className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Product */}
                <div>
                    <h3 className="font-semibold text-foreground mb-3">Product</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                            <Link href="/features" className="hover:text-primary transition-colors">
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link href="/pricing" className="hover:text-primary transition-colors">
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="font-semibold text-foreground mb-3">Resources</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                            <Link href="/help" className="hover:text-primary transition-colors">
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-primary transition-colors">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-semibold text-foreground mb-3">Company</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://buymeacoffee.com/nils.pzr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                            >
                                Support me
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-5 gap-4 text-[0.875rem] text-muted-foreground font-normal leading-normal tracking-tight font-sans">
                    {/* Left */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
                        <p className="text-[0.875rem] leading-normal font-normal font-sans m-0">
                            © {new Date().getFullYear()} Nils Plützer. All rights reserved.
                        </p>

                        {/* Separator */}
                        <span className="text-muted-foreground mx-1 select-none">|</span>

                        <p className="text-[0.875rem] leading-normal font-normal font-sans m-0 flex items-center gap-1">
                            Made with
                            <motion.span
                                className="inline-flex items-center justify-center"
                                whileHover={{ scale: 1.15, rotate: 8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Heart className="h-4 w-4 text-primary" />
                            </motion.span>
                            by
                            <Link
                                href="https://nils-pzr.eu"
                                className="hover:underline underline-offset-4 font-normal text-inherit"
                            >
                                Nils Plützer
                            </Link>
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            All systems operational
                        </div>

                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms
                        </Link>
                        <Link href="/legal-notice" className="hover:text-primary transition-colors">
                            Legal Notice
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}