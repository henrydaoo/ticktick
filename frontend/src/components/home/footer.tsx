import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full lg:relative z-10 p-2 lg:px-14 lg:py-8">
      <div className="container mx-auto flex flex-row justify-between items-center text-white text-xs lg:text-base space-y-0">
        <div className="flex flex-wrap justify-center lg:justify-start space-x-3 lg:space-x-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end space-x-3 lg:space-x-6">
          <Link to="#" className="hover:text-blue-200 transition-colors">
            LinkedIn
          </Link>
          <Link to="#" className="hover:text-blue-200 transition-colors">
            GitHub
          </Link>
          <Link to="#" className="hover:text-blue-200 transition-colors">
            Facebook
          </Link>
        </div>
      </div>
      <div className="container mx-auto border-t border-white mt-2 pt-2 lg:mt-8 lg:pt-6 text-center text-white text-xs lg:text-base flex flex-row justify-center items-center space-y-2 lg:space-y-0 px-4 lg:px-0">
        <span>© {new Date().getFullYear()} TickTick. All rights reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
