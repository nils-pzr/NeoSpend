import HeroSection from "./components/sections/hero-section";
import FeaturesSection from "./components/sections/features-section";
import TestimonialsSection from "./components/sections/testimonials-section";
import CTASection from "./components/sections/cta-section";

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
        </>
    );
}