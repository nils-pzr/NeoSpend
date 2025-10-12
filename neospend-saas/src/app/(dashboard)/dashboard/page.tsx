"use client";

import { motion } from "framer-motion";
import DashboardHeader from "./components/DashboardHeader";
import KPICards from "./components/KPICards";
import QuickActions from "./components/QuickActions";
import DashboardChart from "./components/DashboardChart";
import BudgetOverview from "./components/BudgetOverview";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <DashboardHeader />
            <KPICards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Linke Spalte */}
                <div className="lg:col-span-2 space-y-6">
                    <QuickActions />
                    <DashboardChart />
                    <BudgetOverview />
                </div>

                {/* Rechte Spalte */}
                <div className="lg:col-span-1">
                    <RecentTransactions />
                </div>
            </div>
        </motion.div>
    );
}
