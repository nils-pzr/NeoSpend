"use client";

import { useId } from "react";
import { MicIcon, SearchIcon } from "lucide-react";
import Logo from "@/components/navbar-components/logo";
import ThemeToggle from "@/components/navbar-components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Navbar() {
    const id = useId();

    return (
        <header className="border-b border-border px-4 md:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex h-16 items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex-1">
                    <Link href="/" className="text-primary hover:text-primary/90 flex items-center gap-2">
                        <Logo />
                    </Link>
                </div>

                {/* Middle area */}
                <div className="grow max-sm:hidden">
                    <div className="relative mx-auto w-full max-w-xs">
                        <Input
                            id={id}
                            className="peer h-8 px-8"
                            placeholder="Search..."
                            type="search"
                        />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                            <SearchIcon size={16} />
                        </div>
                        <button
                            className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                            aria-label="Press to speak"
                            type="submit"
                        >
                            <MicIcon size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-1 items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-sm">
                        <Link href="#community">Community</Link>
                    </Button>
                    <Button asChild size="sm" className="text-sm">
                        <Link href="/pricing">Get Started</Link>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}