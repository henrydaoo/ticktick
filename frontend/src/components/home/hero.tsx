import Logo from "@/components/logo";

const HeroSection = () => {
  return (
    <div className="container relative z-10 pt-16 lg:pt-28 h-auto mx-auto px-4 lg:px-8 text-center flex flex-col items-center pb-8 lg:pb-0">
      <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-6 animate-slide-up">
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
      <h1 className="text-lg lg:text-3xl font-medium leading-tight text-white px-2 lg:px-4 mb-3 lg:mb-8 animate-slide-up-delay">
        Modern Project Management with Real-time Collaboration
      </h1>
      <div className="w-full flex-grow lg:flex-1 flex items-start justify-center animate-slide-up-delay">
        <picture>
          <img
            src="/images/hero.png"
            alt="TickTick Dashboard"
            width={800}
            height={500}
            className="max-w-[90%] lg:max-w-[85%] mx-auto h-[400px] lg:h-[500px] object-contain"
          />
        </picture>
      </div>
    </div>
  );
};

export default HeroSection;
