import Background from "@/components/home/background";
import CTA from "@/components/home/cta";
import Header from "@/components/home/header";
import HeroSection from "@/components/home/hero";
import Footer from "@/components/home/footer";

const HomePage = () => {
  return (
    <div className="font-sans antialiased bg-[#084FFF] relative min-h-screen">
      <Header />
      <HeroSection />
      <CTA />
      <Footer />
      <Background />
    </div>
  );
};

export default HomePage;
