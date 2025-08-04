import Logo from "@/components/logo";

const HeroSection = () => {
  return (
    <div className="container relative z-10 pt-16 lg:pt-28 h-auto mx-auto px-4 lg:px-8 text-center flex flex-col items-center pb-8 lg:pb-0">
      <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-6">
        <div className="hidden lg:block">
          <Logo size="lg" />
        </div>
        <div className="block lg:hidden">
          <Logo size="sm" />
        </div>
        <span className="text-xl lg:text-3xl font-medium text-white">
          TickTick
        </span>
      </div>
      <h1 className="text-lg lg:text-3xl font-medium leading-tight text-white px-2 lg:px-4 mb-3 lg:mb-8">
        Modern Project Management with Real-time Collaboration
      </h1>
      <div className="w-full flex-grow lg:flex-1 flex items-start justify-center">
        <img
          src="/images/hero.png"
          alt="TickTick Dashboard"
          className="max-w-[90%] lg:max-w-[85%] mx-auto max-h-[400px] lg:max-h-[500px] w-auto h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default HeroSection;
