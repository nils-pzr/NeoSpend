export const siteConfig = {
    title: 'NeoSpend',
    description:
        'NeoSpend is a modern, minimalist SaaS platform for personal finance management. Track your income and expenses, gain insights through analytics, and take control of your financial life — fast, secure, and beautifully designed.',
    url: 'https://neospend.app',
    author: 'Nils Plützer',
    keywords: [
        'NeoSpend',
        'Finance tracker',
        'Expense tracker',
        'Income tracker',
        'Personal finance app',
        'Budget management',
        'Financial analytics',
        'SaaS app',
        'Money management',
        'Spending insights',
        'Savings tracker',
        'Next.js',
        'Supabase',
        'Tailwind CSS',
        'Shadcn UI',
        'Framer Motion',
        'Modern UI',
        'Minimal design',
        'Dashboard app',
        'Web app',
        'Financial planning',
        'Finance dashboard',
        'Secure login',
        'Magic link',
        'Supabase Auth',
        'Next.js SaaS',
        'Expense management',
    ],

    // 🔍 Default metadata for <head>
    metadataBase: new URL('https://neospend.app'),
    openGraph: {
        title: 'NeoSpend — Personal Finance Tracker',
        description:
            'Track your income, expenses, and insights with NeoSpend — the modern, minimalist SaaS for managing your finances.',
        url: 'https://neospend.app',
        siteName: 'NeoSpend',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'NeoSpend Dashboard Preview',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NeoSpend — Personal Finance Tracker',
        description:
            'Track your income, expenses, and insights with NeoSpend — fast, secure, and beautifully designed.',
        images: ['/og-image.png'],
        creator: '@nils_pzr',
    },
};