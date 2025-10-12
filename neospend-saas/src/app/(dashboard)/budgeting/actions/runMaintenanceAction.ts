"use server";

import { initializeBudgetingSystem } from "../initBudgeting";

export async function runMaintenanceAction() {
    try {
        await initializeBudgetingSystem();
        return { success: true };
    } catch (err) {
        console.error("⚠️ runMaintenanceAction failed:", err);
        return { success: false, error: (err as Error).message };
    }
}
