import Background from "@/components/home/background";
import CTA from "@/components/home/cta";
import Header from "@/components/home/header";
import HeroSection from "@/components/home/hero";
import Footer from "@/components/home/footer";
import { usePageVisibility } from "@/hooks/use-page-visibility";

const HomePage = () => {
  const { hasBeenVisible } = usePageVisibility();

  return (
    <div
      className={`font-sans antialiased bg-[#084FFF] relative min-h-screen flex flex-col ${
        hasBeenVisible ? "page-visible" : ""
      }`}
    >
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
