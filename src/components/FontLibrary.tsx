
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Single default font - Calibri
export const fonts = [
  {
    value: "calibri",
    label: "Calibri",
    category: "sans-serif"
  }
];

// Specific font size options with numeric values
export const fontSizes = [{
  value: "text-xs",
  label: "8",
  numeric: 8
}, {
  value: "text-sm",
  label: "9",
  numeric: 9
}, {
  value: "text-[11px]",
  label: "10",
  numeric: 10
}, {
  value: "text-[12px]",
  label: "11",
  numeric: 11
}, {
  value: "text-base",
  label: "12",
  numeric: 12
}, {
  value: "text-[14px]",
  label: "13",
  numeric: 13
}, {
  value: "text-lg",
  label: "14",
  numeric: 14
}, {
  value: "text-[16px]",
  label: "15",
  numeric: 15
}, {
  value: "text-xl",
  label: "16",
  numeric: 16
}, {
  value: "text-2xl",
  label: "18",
  numeric: 18
}, {
  value: "text-3xl",
  label: "20",
  numeric: 20
}, {
  value: "text-4xl",
  label: "24",
  numeric: 24
}];

// Available color themes
export const themes = [{
  value: "default",
  label: "Default"
}, {
  value: "blue",
  label: "Blue"
}, {
  value: "green",
  label: "Green"
}, {
  value: "purple",
  label: "Purple"
}, {
  value: "amber",
  label: "Amber"
}, {
  value: "red",
  label: "Red"
}];

export type FontLibraryProps = {
  onFontSizeChange: (size: string) => void;
  currentSize?: string;
  isMobile?: boolean;
  // Add the following optional prop to fix the error
  onFontChange?: (font: string) => void;
  currentFont?: string;
};

export function FontLibrary({
  onFontSizeChange,
  currentSize = "text-base",
  isMobile = false,
  // Add the optional parameters (they won't be used but need to be in the interface)
  onFontChange,
  currentFont
}: FontLibraryProps) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const [size, setSize] = useState(currentSize);

  const handleSizeChange = (currentValue: string) => {
    if (!currentValue) return;
    setSize(currentValue);
    setSizeOpen(false);
    onFontSizeChange(currentValue);
  };

  // Define decreaseFontSize and increaseFontSize functions
  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === size);
    if (currentIndex > 0) {
      const newSize = fontSizes[currentIndex - 1].value;
      setSize(newSize);
      onFontSizeChange(newSize);
    }
  };

  // Define the increaseFontSize function
  const increaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === size);
    if (currentIndex < fontSizes.length - 1) {
      const newSize = fontSizes[currentIndex + 1].value;
      setSize(newSize);
      onFontSizeChange(newSize);
    }
  };

  // Find the current font size numeric value
  const currentSizeObj = fontSizes.find(fs => fs.value === size);
  const currentNumericSize = currentSizeObj?.numeric || 12;

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={decreaseFontSize}
              disabled={fontSizes.findIndex(fs => fs.value === size) === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease Font Size</TooltipContent>
        </Tooltip>

        <Popover open={sizeOpen} onOpenChange={setSizeOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={sizeOpen} 
              className="px-2 h-8 min-w-[50px] justify-center"
            >
              {currentNumericSize}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[120px] p-0">
            <Command>
              <CommandInput placeholder="Size..." />
              <CommandEmpty>No size found.</CommandEmpty>
              <CommandGroup>
                {fontSizes.map(fontSize => (
                  <CommandItem 
                    key={fontSize.value} 
                    value={fontSize.value} 
                    onSelect={handleSizeChange}
                  >
                    <span className={fontSize.value}>{fontSize.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={increaseFontSize}
              disabled={fontSizes.findIndex(fs => fs.value === size) === fontSizes.length - 1}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase Font Size</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
