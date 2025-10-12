// app/(dashboard)/dashboard/page.tsx
import DashboardHeader from "./components/DashboardHeader";
import KPICards from "./components/KPICards";
import QuickActions from "./components/QuickActions";
import DashboardChart from "./components/DashboardChart";
import BudgetOverview from "./components/BudgetOverview";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardHeader />

            <KPICards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <QuickActions />
                    <DashboardChart />
                    <BudgetOverview />
                </div>
                <div className="lg:col-span-1">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
