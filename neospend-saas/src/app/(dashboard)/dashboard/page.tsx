"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    PiggyBank,
    Wallet,
    BarChart3,
    Settings,
    ListOrdered,
    Wallet2,
} from "lucide-react";

export default function DashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Greeting */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back 👋
                </h1>
                <p className="text-muted-foreground text-sm">
                    Here’s an overview of your financial activity this month.
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Balance
                        </CardTitle>
                        <Wallet className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">€ 12.480</p>
                        <p className="text-xs text-muted-foreground mt-1">as of today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Income
                        </CardTitle>
                        <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">€ 3.200</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Expenses
                        </CardTitle>
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">€ 2.780</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            −5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Savings Rate
                        </CardTitle>
                        <PiggyBank className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">13%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            steady this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions + Recent Transactions */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button asChild variant="default" className="flex-1">
                            <Link href="/dashboard/transactions">
                                <ListOrdered className="mr-2 h-4 w-4" />
                                View Transactions
                            </Link>
                        </Button>

                        <Button asChild variant="secondary" className="flex-1">
                            <Link href="/dashboard/budgeting">
                                <Wallet2 className="mr-2 h-4 w-4" />
                                Manage Budgets
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/dashboard/analytics">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="flex-1">
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span className="text-sm">Rewe Supermarkt</span>
                            <span className="text-sm font-medium text-red-500">− €23.49</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span className="text-sm">Spotify</span>
                            <span className="text-sm font-medium text-red-500">− €9.99</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span className="text-sm">Gehalt</span>
                            <span className="text-sm font-medium text-green-500">
                + €1.250
              </span>
                        </div>
                        <Button asChild variant="secondary" className="w-full mt-2">
                            <Link href="/dashboard/transactions">View All</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}