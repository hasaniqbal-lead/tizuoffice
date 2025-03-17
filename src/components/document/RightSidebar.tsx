
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Share2, 
  Printer, 
  Camera,
  Search,
  FileSymlink
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RightSidebarProps {
  onSave: () => void;
  onShare: () => void;
  onPrint: () => void;
}

export function RightSidebar({ onSave, onShare, onPrint }: RightSidebarProps) {
  const handleScreenshot = () => {
    toast({
      title: "Screenshot Captured",
      description: "Document screenshot has been saved"
    });
  };

  const handleFindReplace = () => {
    toast({
      title: "Find & Replace",
      description: "Find and Replace tool opened"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Options",
      description: "Export options dialog opened"
    });
  };

  return (
    <div className="w-[220px] h-full bg-background border-l border-border p-3 flex flex-col">
      <div className="space-y-1 mb-4">
        <p className="text-sm font-medium mb-2">Document Actions</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={onSave}>
              <Save className="h-5 w-5" />
              <span className="text-xs">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save document</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={onPrint}>
              <Printer className="h-5 w-5" />
              <span className="text-xs">Print</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print document</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={onShare}>
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share document</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleScreenshot}>
              <Camera className="h-5 w-5" />
              <span className="text-xs">Screenshot</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Take screenshot of document</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleFindReplace}>
              <Search className="h-5 w-5" />
              <span className="text-xs">Find & Replace</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Find and replace text</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center w-full gap-1" onClick={handleExport}>
              <FileSymlink className="h-5 w-5" />
              <span className="text-xs">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export document</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
