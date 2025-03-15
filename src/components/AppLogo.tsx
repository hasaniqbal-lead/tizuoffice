
import React from "react";
import { Link } from "react-router-dom";

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/8bc1b1ac-172b-47ea-9602-a1c53ad6872d.png" 
        alt="tizu logo" 
        className="app-logo light h-8" 
      />
      <img 
        src="/lovable-uploads/8bc1b1ac-172b-47ea-9602-a1c53ad6872d.png" 
        alt="tizu logo" 
        className="app-logo dark h-8" 
      />
    </Link>
  );
}
