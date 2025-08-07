import { Suspense, lazy } from "react";
const Background = lazy(() => import("@/components/home/background"));
const CTA = lazy(() => import("@/components/home/cta"));
const Header = lazy(() => import("@/components/home/header"));
const HeroSection = lazy(() => import("@/components/home/hero"));
const Footer = lazy(() => import("@/components/home/footer"));
import { usePageVisibility } from "@/hooks/use-page-visibility";

const HomePage = () => {
  const { hasBeenVisible } = usePageVisibility();

  return (
    <div
      className={`font-sans antialiased bg-[#084FFF] relative min-h-screen flex flex-col ${
        hasBeenVisible ? "page-visible" : ""
      }`}
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>
        <main className="flex-1">
          <Suspense fallback={<div className="h-32" />}>
            <HeroSection />
          </Suspense>
          <Suspense fallback={null}>
            <CTA />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <Background />
      </Suspense>
    </div>
  );
};

export default HomePage;
