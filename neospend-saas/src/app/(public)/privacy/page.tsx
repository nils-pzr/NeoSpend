import Link from "next/link";

export const metadata = {
    title: "Privacy Policy – Nils Plützer",
    description: "Privacy Policy for the website nils-pzr.eu",
};

export default function PrivacyPolicy() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-muted-foreground">
            <h1 className="text-3xl font-semibold mb-6 text-foreground">Privacy Policy</h1>

            <p className="mb-4">
                This Privacy Policy describes how personal information is collected, used, and shared when you
                visit <strong>nils-pzr.eu</strong>.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">1. Responsible Party</h2>
            <p className="mb-4">
                Nils Plützer
                <br />
                Email: <Link href="mailto:business.nilspzr@gmail.com" className="underline underline-offset-2">business.nilspzr@gmail.com</Link>
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">2. Data Collection</h2>
            <p className="mb-4">
                When you visit this website, certain information (such as IP address, browser type, and pages
                visited) may be automatically collected to ensure proper functionality and security.
            </p>
            <p className="mb-4">
                If you use the contact form, your entered information (email address, message, and name if
                provided) will be processed solely to respond to your inquiry.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">3. Data Storage & Security</h2>
            <p className="mb-4">
                Your data is processed and stored securely. Technical and organizational measures are in place
                to protect against unauthorized access and misuse.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">4. Third-Party Services</h2>
            <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Hosting via <strong>Vercel Inc.</strong>, San Francisco, USA</li>
                <li>Database and authentication via <strong>Supabase</strong></li>
                <li>Email service via <strong>Resend</strong></li>
            </ul>
            <p className="mb-4">
                These services may process data outside the EU. They comply with appropriate data protection
                standards such as Standard Contractual Clauses (SCCs).
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">5. Your Rights</h2>
            <p className="mb-4">
                You have the right to access, correct, or delete your personal data. For questions or requests,
                contact me directly at{" "}
                <Link href="mailto:business.nilspzr@gmail.com" className="underline underline-offset-2">
                    business.nilspzr@gmail.com
                </Link>
                .
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">6. Updates</h2>
            <p>
                This policy may be updated from time to time. Last updated: {new Date().getFullYear()}.
            </p>
        </main>
    );
}