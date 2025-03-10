
import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Comprehensive Google Fonts collection (popular options)
export const fonts = [
  { value: "inter", label: "Inter", category: "sans-serif" },
  { value: "roboto", label: "Roboto", category: "sans-serif" },
  { value: "open-sans", label: "Open Sans", category: "sans-serif" },
  { value: "lato", label: "Lato", category: "sans-serif" },
  { value: "poppins", label: "Poppins", category: "sans-serif" },
  { value: "montserrat", label: "Montserrat", category: "sans-serif" },
  { value: "raleway", label: "Raleway", category: "sans-serif" },
  { value: "oswald", label: "Oswald", category: "sans-serif" },
  { value: "source-sans-pro", label: "Source Sans Pro", category: "sans-serif" },
  { value: "ubuntu", label: "Ubuntu", category: "sans-serif" },
  { value: "playfair-display", label: "Playfair Display", category: "serif" },
  { value: "merriweather", label: "Merriweather", category: "serif" },
  { value: "lora", label: "Lora", category: "serif" },
  { value: "pt-serif", label: "PT Serif", category: "serif" },
  { value: "roboto-slab", label: "Roboto Slab", category: "serif" },
  { value: "crimson-text", label: "Crimson Text", category: "serif" },
  { value: "archivo-black", label: "Archivo Black", category: "display" },
  { value: "bebas-neue", label: "Bebas Neue", category: "display" },
  { value: "comfortaa", label: "Comfortaa", category: "display" },
  { value: "pacifico", label: "Pacifico", category: "handwriting" },
  { value: "dancing-script", label: "Dancing Script", category: "handwriting" },
  { value: "caveat", label: "Caveat", category: "handwriting" },
  { value: "courier-prime", label: "Courier Prime", category: "monospace" },
  { value: "roboto-mono", label: "Roboto Mono", category: "monospace" },
  { value: "space-mono", label: "Space Mono", category: "monospace" },
];

export const fontSizes = [
  { value: "text-xs", label: "Extra Small" },
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Medium" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
  { value: "text-2xl", label: "2XL" },
  { value: "text-3xl", label: "3XL" },
  { value: "text-4xl", label: "4XL" },
];

// Available color themes
export const themes = [
  { value: "default", label: "Default" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "amber", label: "Amber" },
  { value: "red", label: "Red" },
];

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
  isMobile = false,
}: FontLibraryProps) {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [value, setValue] = useState(currentFont);
  const [size, setSize] = useState(currentSize);
  const [filter, setFilter] = useState<string | null>(null);

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

  const handleFilterChange = (category: string) => {
    setFilter(category === filter ? null : category);
  };

  const filteredFonts = filter 
    ? fonts.filter(font => font.category === filter)
    : fonts;

  const selectedFont = fonts.find((font) => font.value === value);
  const selectedSize = fontSizes.find((fontSize) => fontSize.value === size);

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
              {filteredFonts.map((font) => (
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

      <Popover open={sizeOpen} onOpenChange={setSizeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={sizeOpen}
            className={`${isMobile ? 'w-full' : 'w-[130px]'} justify-between h-8`}
          >
            {selectedSize?.label || "Size..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search size..." />
            <CommandEmpty>No size found.</CommandEmpty>
            <CommandGroup>
              {fontSizes.map((fontSize) => (
                <CommandItem
                  key={fontSize.value}
                  value={fontSize.value}
                  onSelect={handleSizeChange}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      size === fontSize.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className={fontSize.value}>{fontSize.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
