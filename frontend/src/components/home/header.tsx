import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/logo";
const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-2 lg:py-4 px-2 lg:px-0 animate-header-appear">
      <div className="container mx-auto bg-white rounded-lg lg:rounded-xl shadow-lg border border-gray-100 flex justify-between items-center p-1 lg:py-2 lg:px-3">
        <div className="flex items-center space-x-2">
          <Logo />
          <span className="text-lg lg:text-xl font-bold text-gray-800">
            TickTick
          </span>
        </div>

        <div className="hidden lg:flex space-x-3 lg:space-x-4 items-center">
          <Link
            to="/sign-in"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-xs lg:text-sm hover:bg-blue-700 hover:scale-[102%] transition-all shadow"
          >
            Get Started Free
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none p-1"
          aria-label="Open navigation menu"
        >
          <svg
            className="h-5 w-5 lg:h-6 lg:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg py-4 mt-2 rounded-xl border border-gray-100 mx-2">
          <Link
            to="/sign-in"
            className="block px-4 py-3 text-gray-800 hover:bg-gray-100 text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="block mx-4 mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 text-center text-sm"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
