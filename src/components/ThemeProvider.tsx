
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export type ThemeClass = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

export const themeClasses: Record<string, ThemeClass> = {
  default: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    background: "var(--background)",
  },
  blue: {
    primary: "hsl(210, 100%, 50%)",
    secondary: "hsl(210, 50%, 80%)",
    accent: "hsl(210, 100%, 30%)",
    background: "hsl(210, 20%, 98%)",
  },
  green: {
    primary: "hsl(142, 76%, 36%)",
    secondary: "hsl(142, 50%, 90%)",
    accent: "hsl(142, 76%, 18%)",
    background: "hsl(142, 20%, 98%)",
  },
  purple: {
    primary: "hsl(270, 80%, 50%)",
    secondary: "hsl(270, 50%, 90%)",
    accent: "hsl(270, 80%, 30%)",
    background: "hsl(270, 20%, 98%)",
  },
  amber: {
    primary: "hsl(45, 100%, 50%)",
    secondary: "hsl(45, 50%, 90%)",
    accent: "hsl(45, 100%, 30%)",
    background: "hsl(45, 20%, 98%)",
  },
  red: {
    primary: "hsl(0, 100%, 50%)",
    secondary: "hsl(0, 50%, 90%)",
    accent: "hsl(0, 100%, 30%)",
    background: "hsl(0, 20%, 98%)",
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("default");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedDarkMode = localStorage.getItem("darkMode");
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", String(newValue));
      
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newValue;
    });
  };

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply theme-specific CSS variables
    const root = document.documentElement;
    const themeClass = themeClasses[newTheme];
    
    if (themeClass) {
      // Apply theme colors based on light/dark mode
      if (newTheme !== "default") {
        // In a full implementation, we would apply all theme colors here
        // This is a simplified version
        const themePrefix = isDarkMode ? "dark-" : "";
        document.documentElement.style.setProperty(`--${themePrefix}theme-primary`, themeClass.primary);
      } else {
        // Reset to default theme
        document.documentElement.style.removeProperty("--theme-primary");
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: changeTheme,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
