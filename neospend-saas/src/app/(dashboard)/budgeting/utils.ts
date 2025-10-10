export const formatCurrency = (value: number, locale = "de-DE", currency: string = "EUR") =>
    new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export const daysInMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const daysLeftInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
};

export const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
};

// YYYYMM (z. B. 202510)
export const getCurrentMonthKey = () => {
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return Number(`${now.getFullYear()}${m}`);
};
