
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHighContrast } from "@/hooks/use-high-contrast";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export function HighContrastToggle() {
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      {!isMobile && <span className="text-sm font-medium">High Contrast</span>}
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch
            checked={isHighContrast}
            onCheckedChange={toggleHighContrast}
            aria-label="Toggle high contrast mode"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isHighContrast ? "Disable" : "Enable"} high contrast mode</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
