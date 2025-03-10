
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
import { useState, useEffect } from "react";

// Popular Google Fonts
const fonts = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "poppins", label: "Poppins" },
  { value: "montserrat", label: "Montserrat" },
  { value: "playfair-display", label: "Playfair Display" },
  { value: "merriweather", label: "Merriweather" },
  { value: "raleway", label: "Raleway" },
  { value: "oswald", label: "Oswald" },
  { value: "source-sans-pro", label: "Source Sans Pro" },
  { value: "ubuntu", label: "Ubuntu" },
];

const fontSizes = [
  { value: "text-xs", label: "Extra Small" },
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Medium" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
  { value: "text-2xl", label: "2XL" },
  { value: "text-3xl", label: "3XL" },
];

export type FontSelectorProps = {
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  currentFont?: string;
  currentSize?: string;
};

export function FontSelector({
  onFontChange,
  onFontSizeChange,
  currentFont = "inter",
  currentSize = "text-base",
}: FontSelectorProps) {
  const [open, setOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [value, setValue] = useState(currentFont);
  const [size, setSize] = useState(currentSize);

  // Load Google Fonts
  useEffect(() => {
    // Create link element for Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Raleway:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Ubuntu:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleFontChange = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    onFontChange(currentValue);
  };

  const handleSizeChange = (currentValue: string) => {
    setSize(currentValue);
    setSizeOpen(false);
    onFontSizeChange(currentValue);
  };

  const selectedFont = fonts.find((font) => font.value === value);
  const selectedSize = fontSizes.find((fontSize) => fontSize.value === size);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[140px] justify-between h-8"
          >
            <span style={{ fontFamily: value }}>
              {selectedFont?.label || "Select font..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search font..." />
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {fonts.map((font) => (
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
            className="w-[130px] justify-between h-8"
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
