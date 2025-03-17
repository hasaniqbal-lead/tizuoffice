
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  ListOrdered, 
  List, 
  Table2, 
  SplitSquareVertical, 
  TextCursorInput,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Smartphone,
  Tablet
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fonts, fontSizes } from "@/components/FontLibrary";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TopRibbonProps {
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  currentFont: string;
  currentSize: string;
  onStyleClick: (style: string) => void;
  onInsert: (type: string) => void;
  orientation: "portrait" | "landscape";
  onOrientationChange: (orientation: "portrait" | "landscape") => void;
}

export function TopRibbon({
  onFontChange,
  onFontSizeChange,
  currentFont,
  currentSize,
  onStyleClick,
  onInsert,
  orientation,
  onOrientationChange
}: TopRibbonProps) {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  // Find the current font size numeric value
  const currentSizeObj = fontSizes.find(fs => fs.value === currentSize);
  const currentNumericSize = currentSizeObj?.numeric || 12;

  const handleHeadingClick = (level: number) => {
    onStyleClick(`heading${level}`);
  };

  const handlePageBreak = () => {
    onInsert("pageBreak");
  };

  const handleTextFormat = (format: string) => {
    onStyleClick(format);
  };

  const handleInsertTable = () => {
    onInsert("table");
  };

  const handleAlignment = (alignment: string) => {
    onStyleClick(`align-${alignment}`);
  };

  const handleListClick = (listType: string) => {
    onStyleClick(listType);
  };

  const increaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === currentSize);
    if (currentIndex < fontSizes.length - 1) {
      const newSize = fontSizes[currentIndex + 1].value;
      onFontSizeChange(newSize);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(fs => fs.value === currentSize);
    if (currentIndex > 0) {
      const newSize = fontSizes[currentIndex - 1].value;
      onFontSizeChange(newSize);
    }
  };

  const handleFontChange = (currentValue: string) => {
    setFontOpen(false);
    onFontChange(currentValue);
  };

  const handleSizeChange = (currentValue: string) => {
    setSizeOpen(false);
    onFontSizeChange(currentValue);
  };

  const selectedFont = fonts.find(font => font.value === currentFont);

  return (
    <div className="w-full bg-background border-b border-border p-2 flex items-center gap-3 overflow-x-auto">
      <div className="flex items-center gap-2">
        {/* Font Family Dropdown */}
        <Popover open={fontOpen} onOpenChange={setFontOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={fontOpen} 
              className="min-w-[160px] justify-between h-8"
            >
              <span style={{ fontFamily: currentFont }}>
                {selectedFont?.label || "Select font..."}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0">
            <Command>
              <CommandInput placeholder="Search font..." />
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {fonts.map(font => (
                  <CommandItem key={font.value} value={font.value} onSelect={handleFontChange}>
                    <Check 
                      className={cn("mr-2 h-4 w-4", currentFont === font.value ? "opacity-100" : "opacity-0")} 
                    />
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Font Size Controls */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={decreaseFontSize}
                disabled={fontSizes.findIndex(fs => fs.value === currentSize) === 0}
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
                        className={cn("mr-2 h-4 w-4", currentSize === fontSize.value ? "opacity-100" : "opacity-0")} 
                      />
                      <span>{fontSize.label}</span>
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
                disabled={fontSizes.findIndex(fs => fs.value === currentSize) === fontSizes.length - 1}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Increase Font Size</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleTextFormat("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleTextFormat("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic (Ctrl+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleTextFormat("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline (Ctrl+U)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleHeadingClick(1)}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleHeadingClick(2)}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleAlignment("left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleAlignment("center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleAlignment("right")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleAlignment("justify")}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Justify</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleListClick("bullet")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => handleListClick("numbered")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Insertions */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleInsertTable}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Table</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handlePageBreak}
            >
              <SplitSquareVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Page Break</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Orientation Toggle */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={orientation === "portrait" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onOrientationChange("portrait")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Portrait Orientation</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={orientation === "landscape" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onOrientationChange("landscape")}
            >
              <Tablet className="h-4 w-4 rotate-90" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Landscape Orientation</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
