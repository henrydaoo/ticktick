import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = (props: {
  url?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const { url = "/", size = "sm", className = "" } = props;

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  const radiusClasses = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
  };

  return (
    <div
      className={`flex items-center justify-center sm:justify-start ${className}`}
    >
      <Link to={url}>
        <div
          className={`flex ${sizeClasses[size]} size- items-center justify-center ${radiusClasses[size]} bg-primary text-primary-foreground`}
        >
          <CircleCheckBig className={iconSizeClasses[size]} />
        </div>
      </Link>
    </div>
  );
};

export default Logo;
