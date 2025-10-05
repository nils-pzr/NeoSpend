import Link from "next/link";

export const metadata = {
    title: "Imprint – Nils Plützer",
    description: "Legal information and imprint for nils-pzr.eu",
};

export default function Imprint() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-muted-foreground">
            <h1 className="text-3xl font-semibold mb-6 text-foreground">Imprint</h1>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">Information according to §5 TMG</h2>
            <p className="mb-4">
                Nils Plützer
                <br />
                (Private Individual / Freelancer)
                <br />
                Email:{" "}
                <Link href="mailto:business.nilspzr@gmail.com" className="underline underline-offset-2">
                    business.nilspzr@gmail.com
                </Link>
                <br />
                Website: <Link href="https://nils-pzr.eu" className="underline underline-offset-2">nils-pzr.eu</Link>
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">Disclaimer</h2>
            <p className="mb-4">
                Despite careful control of content, I assume no liability for external links. The operators of
                linked sites are solely responsible for their content.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">Copyright</h2>
            <p className="mb-4">
                All content and works created by Nils Plützer are protected by copyright. Reproduction,
                modification, or distribution requires prior written permission.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-foreground">EU Dispute Resolution</h2>
            <p>
                Information according to the EU Regulation on Online Dispute Resolution in consumer matters:
                <br />
                <Link
                    href="https://ec.europa.eu/consumers/odr"
                    className="underline underline-offset-2"
                    target="_blank"
                >
                    https://ec.europa.eu/consumers/odr
                </Link>
            </p>
        </main>
    );
}