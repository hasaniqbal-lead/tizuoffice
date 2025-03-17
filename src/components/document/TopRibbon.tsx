
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
  AlignJustify
} from "lucide-react";
import { FontLibrary } from "@/components/FontLibrary";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TopRibbonProps {
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  currentFont: string;
  currentSize: string;
  onStyleClick: (style: string) => void;
  onInsert: (type: string) => void;
}

export function TopRibbon({
  onFontChange,
  onFontSizeChange,
  currentFont,
  currentSize,
  onStyleClick,
  onInsert
}: TopRibbonProps) {
  const isMobile = useIsMobile();

  const handleHeadingClick = (level: number) => {
    toast({
      title: `Heading ${level} Applied`,
      description: `Heading level ${level} has been applied to selected text`
    });
    onStyleClick(`heading${level}`);
  };

  const handlePageBreak = () => {
    toast({
      title: "Page Break Inserted",
      description: "A page break has been inserted at the cursor position"
    });
    onInsert("pageBreak");
  };

  const handleTextFormat = (format: string) => {
    toast({
      title: `${format.charAt(0).toUpperCase() + format.slice(1)} formatting applied`,
      description: `${format.charAt(0).toUpperCase() + format.slice(1)} formatting has been applied to the selected text`
    });
    onStyleClick(format);
  };

  const handleInsertTable = () => {
    toast({
      title: "Table Inserted",
      description: "A table has been inserted at the cursor position"
    });
    onInsert("table");
  };

  const handleAlignment = (alignment: string) => {
    toast({
      title: `Text ${alignment} aligned`,
      description: `Text has been ${alignment} aligned`
    });
    onStyleClick(`align-${alignment}`);
  };

  const handleListClick = (listType: string) => {
    toast({
      title: `${listType === 'bullet' ? 'Bullet' : 'Numbered'} List Applied`,
      description: `A ${listType === 'bullet' ? 'bullet' : 'numbered'} list has been created`
    });
    onStyleClick(listType);
  };

  return (
    <div className="w-full bg-background border-b border-border p-2 flex items-center gap-3 overflow-x-auto">
      <div className="flex items-center gap-2">
        <FontLibrary
          onFontChange={onFontChange}
          onFontSizeChange={onFontSizeChange}
          currentFont={currentFont}
          currentSize={currentSize}
          isMobile={isMobile}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

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
    </div>
  );
}
