export type BlogPost = {
    slug: string;
    title: string;
    date: string;
    desc: string;
    tags: string[];
    category: 'Product' | 'Tips' | 'Updates';
    content: string; // Markdown oder Plaintext
};

export const posts: BlogPost[] = [
    {
        slug: 'introducing-neospend',
        title: 'Introducing NeoSpend',
        date: 'October 5, 2025',
        desc: 'How we’re redefining personal finance tracking with automation and AI.',
        tags: ['Product', 'AI', 'Launch'],
        category: 'Product',
        content: `
### Welcome to NeoSpend 🚀

NeoSpend helps you **take control of your finances** through smart automation, live analytics, and a beautiful user experience.

#### Key Features
- Automatic expense tracking via bank connection or CSV
- Real-time analytics dashboard
- Secure encryption and privacy-first design

Whether you're a freelancer or small business, NeoSpend helps you *spend smarter* and *save more*.
    `,
    },
    {
        slug: 'budget-tips',
        title: 'Saving smarter: 5 tips to boost your budget',
        date: 'September 21, 2025',
        desc: 'Practical strategies to make your money last longer.',
        tags: ['Finance', 'Tips'],
        category: 'Tips',
        content: `
### 5 Tips to Save Smarter 💡

1. **Automate your savings** — set up recurring transfers to your savings account.  
2. **Track expenses weekly** — awareness is the first step to control.  
3. **Cook at home** — small daily savings compound.  
4. **Cancel unused subscriptions.**  
5. **Use NeoSpend to monitor your trends** and visualize spending behavior.

Small consistent actions create *big long-term results*.
    `,
    },
    {
        slug: 'dashboard-insights-v12',
        title: 'New Dashboard Insights — Version 1.2',
        date: 'September 14, 2025',
        desc: 'We’ve redesigned the analytics panel for clarity and speed.',
        tags: ['Updates', 'UI/UX'],
        category: 'Updates',
        content: `
### Dashboard v1.2 Highlights 📊

- **Cleaner charts:** New color palette and improved contrast  
- **Performance:** Loading times reduced by 40%  
- **Custom categories:** You can now define your own expense types  

We’re constantly improving NeoSpend to give you better insights and more control.
    `,
    },
];