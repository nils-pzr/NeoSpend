export const metadata = {
    title: "Terms of Service – Nils Plützer",
    description: "Terms and Conditions for using nils-pzr.eu",
};

export default function Terms() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-muted-foreground">
            <h1 className="text-3xl font-semibold mb-6 text-foreground">Terms of Service</h1>

            <p className="mb-4">
                By accessing and using <strong>nils-pzr.eu</strong>, you agree to the following terms and
                conditions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">1. General</h2>
            <p className="mb-4">
                This website is operated by Nils Plützer as a private and non-commercial portfolio and project
                showcase. Content is provided “as is” without warranty.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">2. Intellectual Property</h2>
            <p className="mb-4">
                All designs, logos, code samples, and visuals displayed on this website are the property of
                Nils Plützer unless stated otherwise. Reproduction or distribution without permission is
                prohibited.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">3. External Links</h2>
            <p className="mb-4">
                This site may contain links to third-party websites. I am not responsible for their content or
                data practices.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">4. Liability</h2>
            <p className="mb-4">
                I assume no liability for the completeness, accuracy, or timeliness of the information provided
                on this website.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">5. Changes</h2>
            <p>
                I reserve the right to modify or update these terms at any time without prior notice. Continued
                use constitutes acceptance of the current version.
            </p>
        </main>
    );
}