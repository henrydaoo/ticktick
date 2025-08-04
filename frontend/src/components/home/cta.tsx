import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <div className="relative z-10 py-4 lg:py-20 text-white">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-lg lg:text-4xl font-semibold mb-4 leading-tight">
          Ready to unify your project management?
        </h2>
        <p className="text-base lg:text-xl max-w-2xl mx-auto mb-6 lg:mb-8 px-4 lg:px-0">
          Experience collaborative project management with integrated real-time
          messaging, workspace organization, and seamless team communication in
          one platform.
        </p>
        <Link
          to="/sign-up"
          className="bg-white text-blue-600 px-3 lg:px-5 py-1 lg:py-2 rounded-full font-semibold text-sm lg:text-lg hover:bg-gray-100 transition-colors duration-300 shadow-xl inline-block"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
};

export default CTA;
