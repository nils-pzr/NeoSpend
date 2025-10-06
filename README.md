# 💸 NeoSpend

**NeoSpend** is a modern, minimalist SaaS application for personal finance management.  
Track your income and expenses, categorize transactions, and gain insights into your financial habits through a clear and interactive dashboard.

> 🧭 Goal: To provide a fast, secure, and beautifully designed all-in-one finance tracker — built with cutting-edge web technologies.

---

## 🚀 Features

- 🔐 **Supabase Auth** with Magic Link & Password Reset  
- 💳 **Transaction Management** (Create, Edit, Delete)  
- 📊 **Analytics & Charts** powered by Recharts  
- 🧠 **Categorization & Filtering** of expenses  
- 🌗 **Light / Dark Mode** with smooth theme transitions  
- ⚡ **High Performance Dashboard** powered by Next.js 15  
- 🎨 **Modern UI/UX** built with Shadcn/UI + Tailwind CSS  
- ✨ **Animations & Microinteractions** using Framer Motion  
- ☁️ **Deploy-ready** with Vercel + Supabase backend  

---

## 🧱 Tech Stack

| Technology | Description |
|-------------|-------------|
| **Next.js 15** | Modern React framework for fullstack web apps |
| **TypeScript** | Strongly typed JavaScript for safer code |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Shadcn/UI** | Beautiful, accessible, and themeable UI components |
| **Supabase** | Open-source backend with Auth, Database & Storage |
| **Drizzle ORM** | Type-safe and high-performance ORM for SQL databases |
| **Framer Motion** | React animation library for fluid motion |
| **Recharts** | React chart library for visual analytics |
| **Vercel** | Hosting platform optimized for Next.js |

---

## 🧭 Project Structure

```
neospend.saas/
├── app/                # Next.js App Router pages & layouts
├── components/         # UI components (Shadcn + custom)
├── lib/                # Configs (Supabase, Drizzle, helpers)
├── styles/             # Tailwind & global styles
├── public/             # Static assets (icons, logos, favicons)
├── .env.local          # Local environment variables
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nils-pzr/NeoSpend.git
cd neospend-saas
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."
```

(Optional)
```bash
SUPABASE_SERVICE_ROLE_KEY=""
RESEND_API_KEY=""
STRIPE_SECRET_KEY=""
```

### 4. Run the development server

```bash
pnpm dev
# or
npm run dev
```

The app will be available at **http://localhost:3000**

---

## ☁️ Deployment

NeoSpend is fully optimized for **Vercel** deployment.

1. Connect your GitHub repository to [Vercel](https://vercel.com)  
2. Import the project  
3. Add your environment variables in **Project Settings → Environment Variables**  
4. Deploy 🎉  

> Every commit to the `main` branch automatically triggers a new build & deployment.

---

## 🧑‍💻 Development Guidelines

- **Formatting:** Prettier  
- **Linting:** ESLint + Tailwind Lint  
- **Commit Convention:** Semantic Commits (`feat:`, `fix:`, `chore:` etc.)  
- **Branching:** `main` (stable) / `dev` (development)  

---

## 📸 Screenshots

*(Add your app screenshots here)*

![Dashboard Screenshot](public/screenshots/dashboard.png)  
![Login Page](public/screenshots/login.png)

---

## 🧭 Roadmap

- 🔄 Import/Export transactions (CSV, XLSX)  
- 💰 Budget planning & category-based insights  
- 🧾 PDF reports & summaries  
- 👥 Multi-user / Team accounts  
- 📱 Full mobile optimization  

---

## ❤️ Credits

Developed by [**Nils Plützer**](https://nils-pzr.eu)  
Built with care, modern design, and focus on performance and usability.

> *“Design meets functionality – manage your money smarter with NeoSpend.”*

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](/neospend-saas/LICENSE.txt) file for more details.

---

## 🌟 Support

If you like this project, please leave a ⭐ on GitHub and visit my portfolio:  
🔗 [https://nils-pzr.eu](https://nils-pzr.eu)
