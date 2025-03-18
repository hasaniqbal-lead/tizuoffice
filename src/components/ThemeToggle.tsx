
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      {!isMobile && <span className="text-sm font-medium">Theme</span>}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {isDarkMode ? "light" : "dark"} mode</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
