export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <h1 className="text-3xl font-bold text-center">Pricing</h1>
            <p className="text-muted-foreground text-center mt-3 max-w-md">
                Hier findest du später transparente Preispläne und Funktionen für NeoSpend.
            </p>

            <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Free</h2>
                    <p className="text-muted-foreground mt-2">Ideal zum Testen</p>
                    <p className="mt-4 text-2xl font-bold">€0</p>
                </div>

                <div className="border rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Pro</h2>
                    <p className="text-muted-foreground mt-2">Für aktive Nutzer</p>
                    <p className="mt-4 text-2xl font-bold">€9<span className="text-sm">/Monat</span></p>
                </div>

                <div className="border rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Business</h2>
                    <p className="text-muted-foreground mt-2">Für Teams & Unternehmen</p>
                    <p className="mt-4 text-2xl font-bold">€29<span className="text-sm">/Monat</span></p>
                </div>
            </div>
        </div>
    );
}
