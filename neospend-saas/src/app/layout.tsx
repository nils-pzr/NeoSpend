import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

import { PropsWithChildren } from "react";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// === Fonts ===
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// === Metadata ===
export const metadata: Metadata = {
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    robots: { index: true, follow: true },
    icons: {
        icon: "/favicon/favicon.ico",
        shortcut: "/favicon/favicon.png",
        apple: "/favicon/favicon.png",
    },
};

// === Layout ===
const RootLayout = ({ children }: PropsWithChildren) => {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
                "min-h-screen bg-background text-foreground antialiased transition-colors",
                geistSans.variable,
                geistMono.variable
            )}
        >
        {/* ThemeProvider sorgt für Light/Dark-Sync */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
};

export default RootLayout;
