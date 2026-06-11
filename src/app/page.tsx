import { AlgorithmSwitcher } from "@/components/landing/algorithm-switcher";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Handlers } from "@/components/landing/handlers";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Handlers />
        <AlgorithmSwitcher />
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  );
}
