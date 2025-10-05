export default function Footer() {
    return (
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
            Built with ❤️ by <span className="text-primary font-medium">Nils</span> • ©{" "}
            {new Date().getFullYear()} NeoSpend
        </footer>
    );
}