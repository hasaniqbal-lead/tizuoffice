
import { useState, useEffect } from "react";

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check if high-contrast mode is already enabled in localStorage
    const savedHighContrast = localStorage.getItem("highContrast");
    
    if (savedHighContrast === "true") {
      setIsHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const newValue = !prev;
      localStorage.setItem("highContrast", String(newValue));
      
      if (newValue) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
      
      return newValue;
    });
  };

  return { isHighContrast, toggleHighContrast };
}
