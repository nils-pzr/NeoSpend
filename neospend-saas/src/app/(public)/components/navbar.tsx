"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import Logo from "@/components/navbar-components/logo";
import ThemeToggle from "@/components/navbar-components/theme-toggle";

// Navigation links (desktop & mobile)
const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    return (
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
                {/* Left side (Logo + Mobile Nav) */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu trigger */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="group size-8 md:hidden"
                                variant="ghost"
                                size="icon"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="pointer-events-none"
                                    width={18}
                                    height={18}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        d="M4 12L20 12"
                                        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                    />
                                </svg>
                            </Button>
                        </PopoverTrigger>

                        {/* Mobile Popover Menu */}
                        <PopoverContent align="start" className="w-40 p-1 md:hidden">
                            <NavigationMenu className="max-w-none *:w-full">
                                <NavigationMenuList className="flex-col items-start gap-0">
                                    {navigationLinks.map((link, i) => (
                                        <NavigationMenuItem key={i} className="w-full">
                                            <NavigationMenuLink
                                                asChild
                                                className="block w-full rounded-md py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                            >
                                                <Link href={link.href}>{link.label}</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </PopoverContent>
                    </Popover>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="max-md:hidden">
                        <NavigationMenuList className="gap-3 ml-4">
                            {navigationLinks.map((link, i) => (
                                <NavigationMenuItem key={i}>
                                    <NavigationMenuLink
                                        asChild
                                        className="text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded-md data-[active=true]:bg-muted data-[active=true]:text-foreground transition-all"
                                    >
                                        <Link href={link.href}>{link.label}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right side (Buttons + ThemeToggle) */}
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-sm">
                        <Link href="/login">Sign In</Link>
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