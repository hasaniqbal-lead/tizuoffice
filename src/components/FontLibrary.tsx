
import { useState, useEffect } from "react";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Comprehensive collection of open-source Google Fonts
export const fonts = [{
  value: "inter",
  label: "Inter",
  category: "sans-serif"
}, {
  value: "roboto",
  label: "Roboto",
  category: "sans-serif"
}, {
  value: "open-sans",
  label: "Open Sans",
  category: "sans-serif"
}, {
  value: "lato",
  label: "Lato",
  category: "sans-serif"
}, {
  value: "poppins",
  label: "Poppins",
  category: "sans-serif"
}, {
  value: "montserrat",
  label: "Montserrat",
  category: "sans-serif"
}, {
  value: "raleway",
  label: "Raleway",
  category: "sans-serif"
}, {
  value: "oswald",
  label: "Oswald",
  category: "sans-serif"
}, {
  value: "source-sans-pro",
  label: "Source Sans Pro",
  category: "sans-serif"
}, {
  value: "ubuntu",
  label: "Ubuntu",
  category: "sans-serif"
}, {
  value: "nunito",
  label: "Nunito",
  category: "sans-serif"
}, {
  value: "work-sans",
  label: "Work Sans",
  category: "sans-serif"
}, {
  value: "rubik",
  label: "Rubik",
  category: "sans-serif"
}, {
  value: "playfair-display",
  label: "Playfair Display",
  category: "serif"
}, {
  value: "merriweather",
  label: "Merriweather",
  category: "serif"
}, {
  value: "lora",
  label: "Lora",
  category: "serif"
}, {
  value: "pt-serif",
  label: "PT Serif",
  category: "serif"
}, {
  value: "roboto-slab",
  label: "Roboto Slab",
  category: "serif"
}, {
  value: "crimson-text",
  label: "Crimson Text",
  category: "serif"
}, {
  value: "archivo-black",
  label: "Archivo Black",
  category: "display"
}, {
  value: "bebas-neue",
  label: "Bebas Neue",
  category: "display"
}, {
  value: "comfortaa",
  label: "Comfortaa",
  category: "display"
}, {
  value: "pacifico",
  label: "Pacifico",
  category: "handwriting"
}, {
  value: "dancing-script",
  label: "Dancing Script",
  category: "handwriting"
}, {
  value: "caveat",
  label: "Caveat",
  category: "handwriting"
}, {
  value: "courier-prime",
  label: "Courier Prime",
  category: "monospace"
}, {
  value: "roboto-mono",
  label: "Roboto Mono",
  category: "monospace"
}, {
  value: "space-mono",
  label: "Space Mono",
  category: "monospace"
}];

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
  currentFont = "inter",
  currentSize = "text-base",
  isMobile = false
}: FontLibraryProps) {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [value, setValue] = useState(currentFont);
  const [size, setSize] = useState(currentSize);
  const [filter, setFilter] = useState<string | null>(null);

  // Find the current font size numeric value
  const currentSizeObj = fontSizes.find(fs => fs.value === size);
  const currentNumericSize = currentSizeObj?.numeric || 12;

  // Load Google Fonts dynamically
  useEffect(() => {
    const fontFamilies = fonts.map(font => {
      if (font.category === "serif") {
        return `family=${font.label.replace(/\s+/g, "+")}:wght@400;700`;
      } else if (font.category === "monospace") {
        return `family=${font.label.replace(/\s+/g, "+")}:wght@400;700`;
      } else if (font.category === "handwriting") {
        return `family=${font.label.replace(/\s+/g, "+")}:wght@400;700`;
      } else if (font.category === "display") {
        return `family=${font.label.replace(/\s+/g, "+")}:wght@400;700`;
      } else {
        return `family=${font.label.replace(/\s+/g, "+")}:wght@400;500;600;700`;
      }
    }).join("&");
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleFontChange = (currentValue: string) => {
    setValue(currentValue);
    setFontOpen(false);
    onFontChange(currentValue);
  };

  const handleSizeChange = (currentValue: string) => {
    setSize(currentValue);
    setSizeOpen(false);
    onFontSizeChange(currentValue);
  };

  const increaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === size);
    if (currentIndex < fontSizes.length - 1) {
      const newSize = fontSizes[currentIndex + 1].value;
      setSize(newSize);
      onFontSizeChange(newSize);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === size);
    if (currentIndex > 0) {
      const newSize = fontSizes[currentIndex - 1].value;
      setSize(newSize);
      onFontSizeChange(newSize);
    }
  };

  const handleFilterChange = (category: string) => {
    setFilter(category === filter ? null : category);
  };

  const filteredFonts = filter ? fonts.filter(font => font.category === filter) : fonts;
  const selectedFont = fonts.find(font => font.value === value);
  const selectedSize = fontSizes.find(fontSize => fontSize.value === size);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
      {!isMobile && (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFilterChange("sans-serif")} 
            className={filter === "sans-serif" ? "bg-secondary" : ""}
          >
            Sans
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFilterChange("serif")} 
            className={filter === "serif" ? "bg-secondary" : ""}
          >
            Serif
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFilterChange("display")} 
            className={filter === "display" ? "bg-secondary" : ""}
          >
            Display
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFilterChange("handwriting")} 
            className={filter === "handwriting" ? "bg-secondary" : ""}
          >
            Script
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFilterChange("monospace")} 
            className={filter === "monospace" ? "bg-secondary" : ""}
          >
            Mono
          </Button>
        </div>
      )}

      <Popover open={fontOpen} onOpenChange={setFontOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={fontOpen} 
            className={`${isMobile ? 'w-full' : 'min-w-[160px]'} justify-between h-8`}
          >
            <span style={{ fontFamily: value }}>
              {selectedFont?.label || "Select font..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput placeholder="Search font..." />
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup heading="Categories" className={isMobile ? 'flex flex-wrap gap-1 p-2' : 'hidden'}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange("sans-serif")} 
                className={`text-xs ${filter === "sans-serif" ? "bg-secondary" : ""}`}
              >
                Sans
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange("serif")} 
                className={`text-xs ${filter === "serif" ? "bg-secondary" : ""}`}
              >
                Serif
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange("display")} 
                className={`text-xs ${filter === "display" ? "bg-secondary" : ""}`}
              >
                Display
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange("handwriting")} 
                className={`text-xs ${filter === "handwriting" ? "bg-secondary" : ""}`}
              >
                Script
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange("monospace")} 
                className={`text-xs ${filter === "monospace" ? "bg-secondary" : ""}`}
              >
                Mono
              </Button>
            </CommandGroup>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredFonts.map(font => (
                <CommandItem key={font.value} value={font.value} onSelect={handleFontChange}>
                  <Check 
                    className={cn("mr-2 h-4 w-4", value === font.value ? "opacity-100" : "opacity-0")} 
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
