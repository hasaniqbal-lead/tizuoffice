
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  FileDigit, 
  ImagePlus, 
  PlusSquare, 
  Printer, 
  FileHeart, 
  WaterDroplet,
  Scan,
  AlignEndHorizontal
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LeftSidebarProps {
  onAddPage: () => void;
  pageSize: string;
  onChangePageSize: (size: string) => void;
}

export function LeftSidebar({ onAddPage, pageSize, onChangePageSize }: LeftSidebarProps) {
  const handleAddHeader = () => {
    toast({
      title: "Header Added",
      description: "Document header has been added"
    });
  };

  const handleAddFooter = () => {
    toast({
      title: "Footer Added",
      description: "Document footer has been added"
    });
  };

  const handleAddWatermark = () => {
    toast({
      title: "Watermark Added",
      description: "Document watermark has been added"
    });
  };

  const handleAddPageNumber = () => {
    toast({
      title: "Page Numbers Added",
      description: "Page numbers have been added to the document"
    });
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        toast({
          title: "Image Added",
          description: "Image has been added to the document"
        });
      }
    };
    input.click();
  };

  return (
    <div className="w-[220px] h-full bg-background border-r border-border p-3 flex flex-col">
      <div className="space-y-1 mb-4">
        <p className="text-sm font-medium mb-2">Document Settings</p>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Page Size</p>
            <Select value={pageSize} onValueChange={onChangePageSize}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={onAddPage}>
              <PlusSquare className="h-5 w-5" />
              <span className="text-xs">Add Page</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a new page</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleInsertImage}>
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs">Insert Image</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert an image</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleAddPageNumber}>
              <FileDigit className="h-5 w-5" />
              <span className="text-xs">Page Numbers</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add page numbers</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleAddHeader}>
              <AlignEndHorizontal className="h-5 w-5" />
              <span className="text-xs">Header</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a header</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleAddFooter}>
              <FileHeart className="h-5 w-5" />
              <span className="text-xs">Footer</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a footer</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleAddWatermark}>
              <WaterDroplet className="h-5 w-5" />
              <span className="text-xs">Watermark</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a watermark</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
