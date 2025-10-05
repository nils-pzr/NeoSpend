export default function PricingPage() {
    return (
        <div className="py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
            <p className="text-muted-foreground mb-8">
                Simple and transparent plans. Choose what fits your needs.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 px-6">
                <div className="border rounded-xl p-8 w-full md:w-80 bg-card shadow">
                    <h2 className="text-xl font-semibold mb-2">Starter</h2>
                    <p className="text-muted-foreground mb-4">Free forever</p>
                    <p className="text-3xl font-bold mb-6">€0</p>
                    <ul className="text-sm space-y-2 text-left mb-6">
                        <li>✔ Basic analytics</li>
                        <li>✔ Up to 50 transactions/month</li>
                        <li>✔ Community support</li>
                    </ul>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition">
                        Choose Plan
                    </button>
                </div>

                <div className="border-2 border-primary rounded-xl p-8 w-full md:w-80 bg-primary/5 shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Pro</h2>
                    <p className="text-muted-foreground mb-4">For growing users</p>
                    <p className="text-3xl font-bold mb-6">€9<span className="text-lg font-medium">/mo</span></p>
                    <ul className="text-sm space-y-2 text-left mb-6">
                        <li>✔ Unlimited transactions</li>
                        <li>✔ Detailed analytics</li>
                        <li>✔ Priority support</li>
                    </ul>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
}