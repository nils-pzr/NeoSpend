import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

import { PropsWithChildren } from "react";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

// === Fonts ===
const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const playfairDisplay = Playfair_Display({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

// === Metadata ===
export const metadata: Metadata = {
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    metadataBase: siteConfig.metadataBase,
    openGraph: siteConfig.openGraph,
    twitter: siteConfig.twitter,
    robots: { index: true, follow: true },
    authors: [{ name: siteConfig.author }],
    icons: {
        icon: "/favicon/favicon.ico",
        shortcut: "/favicon/favicon.png",
        apple: "/favicon/favicon.png",
    },
    alternates: {
        canonical: siteConfig.url,
    },
    category: "finance",
};

// === Layout ===
const RootLayout = ({ children }: PropsWithChildren) => {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}
        >
        <body
            className={cn(
                "min-h-screen bg-background text-foreground antialiased transition-colors font-sans"
            )}
        >
        {/* ✅ ThemeProvider: Light Mode als Standard */}
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
            {children}

            {/* 🔔 Globaler Toast Renderer */}
            <Toaster
                position="top-center"
                richColors
                closeButton
                toastOptions={{
                    classNames: {
                        toast: "bg-background border border-border shadow-md",
                        description: "text-muted-foreground",
                        actionButton: "bg-primary text-white",
                    },
                }}
            />
        </ThemeProvider>
        </body>
        </html>
    );
};

export default RootLayout;