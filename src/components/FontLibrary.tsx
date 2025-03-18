
import { useState, useEffect } from "react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Simplified font selection - just two fonts
export const fonts = [
  {
    value: "arial",
    label: "Arial",
    category: "sans-serif"
  },
  {
    value: "times-new-roman",
    label: "Times New Roman",
    category: "serif"
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
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  currentFont?: string;
  currentSize?: string;
  isMobile?: boolean;
};

export function FontLibrary({
  onFontChange,
  onFontSizeChange,
  currentFont = "arial",
  currentSize = "text-base",
  isMobile = false
}: FontLibraryProps) {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [value, setValue] = useState(currentFont);
  const [size, setSize] = useState(currentSize);

  const handleFontChange = (currentValue: string) => {
    if (!currentValue) return;
    setValue(currentValue);
    setFontOpen(false);
    onFontChange(currentValue);
  };

  const handleSizeChange = (currentValue: string) => {
    if (!currentValue) return;
    setSize(currentValue);
    setSizeOpen(false);
    onFontSizeChange(currentValue);
  };

  // Define the missing decreaseFontSize function
  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === size);
    if (currentIndex > 0) {
      const newSize = fontSizes[currentIndex - 1].value;
      setSize(newSize);
      onFontSizeChange(newSize);
    }
  };

  // Define the missing increaseFontSize function
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
  const selectedFont = fonts.find(font => font.value === value);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
      <Popover open={fontOpen} onOpenChange={setFontOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={fontOpen} 
            className={`${isMobile ? 'w-full' : 'min-w-[160px]'} justify-between h-8`}
          >
            <span style={{ fontFamily: value }}>
              {selectedFont?.label || "Arial"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              {fonts.map(font => (
                <CommandItem
                  key={font.value}
                  value={font.value}
                  onSelect={handleFontChange}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

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
                    <Check 
                      className={cn("mr-2 h-4 w-4", size === fontSize.value ? "opacity-100" : "opacity-0")} 
                    />
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
