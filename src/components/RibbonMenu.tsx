
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  FileText,
  FileSpreadsheet,
  PresentationIcon,
  ChevronDown,
  Save,
  Download,
  Share2,
  Image,
  Table2,
  Link as LinkIcon,
  SquareStack,
  CheckSquare,
  Printer,
  Copy,
  Scissors,
  ClipboardPaste,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Eraser,
  MoveLeft,
  MoveRight,
  Type,
  PaintBucket,
  Palette,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontLibrary } from "@/components/FontLibrary";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface RibbonMenuProps {
  editorType: "document" | "spreadsheet" | "presentation";
  currentFont: string;
  currentSize: string;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onStyleClick: (style: string) => void;
  onAlignClick: (align: string) => void;
  onListClick: (listType: string) => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: (format: string) => void;
  onInsert: (type: string) => void;
}

export function RibbonMenu({
  editorType,
  currentFont,
  currentSize,
  onFontChange,
  onFontSizeChange,
  onStyleClick,
  onAlignClick,
  onListClick,
  onSave,
  onShare,
  onDownload,
  onInsert
}: RibbonMenuProps) {
  const isMobile = useIsMobile();
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };

  const handleInsert = (type: string) => {
    onInsert(type);
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} inserted`,
      description: `Added ${type} to your document`,
    });
  };

  const handleCopyText = () => {
    document.execCommand('copy');
    toast({
      title: "Copied",
      description: "Selected text copied to clipboard",
    });
  };

  const handleCutText = () => {
    document.execCommand('cut');
    toast({
      title: "Cut",
      description: "Selected text cut to clipboard",
    });
  };

  const handlePasteText = () => {
    document.execCommand('paste');
    toast({
      title: "Pasted",
      description: "Content pasted from clipboard",
    });
  };

  const handleUndo = () => {
    document.execCommand('undo');
    toast({
      title: "Undo",
      description: "Last action undone",
    });
  };

  const handleRedo = () => {
    document.execCommand('redo');
    toast({
      title: "Redo",
      description: "Action redone",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print",
      description: "Print dialog opened",
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 10, 200));
    toast({
      title: "Zoom In",
      description: `Zoom level: ${Math.min(zoomLevel + 10, 200)}%`,
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 10, 50));
    toast({
      title: "Zoom Out",
      description: `Zoom level: ${Math.max(zoomLevel - 10, 50)}%`,
    });
  };

  const handleHelp = () => {
    toast({
      title: "Help",
      description: "Help documentation will be available soon",
    });
  };

  const fileExtensions = {
    document: [
      { label: "Word Document (.docx)", value: "docx" },
      { label: "PDF (.pdf)", value: "pdf" },
      { label: "Text (.txt)", value: "txt" }
    ],
    spreadsheet: [
      { label: "Excel (.xlsx)", value: "xlsx" },
      { label: "CSV (.csv)", value: "csv" },
      { label: "PDF (.pdf)", value: "pdf" }
    ],
    presentation: [
      { label: "PowerPoint (.pptx)", value: "pptx" },
      { label: "PDF (.pdf)", value: "pdf" },
      { label: "JPEG Slides (.jpg)", value: "jpg" }
    ]
  };

  // Map editor types to their routes
  const editorRoutes = {
    document: "/document",
    spreadsheet: "/spreadsheet",
    presentation: "/presentation"
  };

  const getEditorIcon = (type: "document" | "spreadsheet" | "presentation") => {
    switch(type) {
      case "document":
        return <FileText className="h-4 w-4 mr-2" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-4 w-4 mr-2" />;
      case "presentation":
        return <PresentationIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Main menubar */}
      <Menubar className="rounded-none border-b border-t-0 border-l-0 border-r-0 px-2 shadow-sm">
        <MenubarMenu>
          <MenubarTrigger className="font-bold">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </MenubarItem>
            <MenubarItem onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </MenubarItem>
            <MenubarSeparator />
            {fileExtensions[editorType].map((ext) => (
              <MenubarItem 
                key={ext.value} 
                onClick={() => onDownload(ext.value)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as {ext.label}
              </MenubarItem>
            ))}
            <MenubarSeparator />
            <MenubarItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleUndo}>
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </MenubarItem>
            <MenubarItem onClick={handleRedo}>
              <Redo className="h-4 w-4 mr-2" />
              Redo
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleCutText}>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </MenubarItem>
            <MenubarItem onClick={handleCopyText}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </MenubarItem>
            <MenubarItem onClick={handlePasteText}>
              <ClipboardPaste className="h-4 w-4 mr-2" />
              Paste
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleInsert("image")}>
              <Image className="h-4 w-4 mr-2" />
              Image
            </MenubarItem>
            <MenubarItem onClick={() => handleInsert("table")}>
              <Table2 className="h-4 w-4 mr-2" />
              Table
            </MenubarItem>
            <MenubarItem onClick={() => handleInsert("link")}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Link
            </MenubarItem>
            {editorType === "presentation" && (
              <MenubarItem onClick={() => handleInsert("slide")}>
                <SquareStack className="h-4 w-4 mr-2" />
                New Slide
              </MenubarItem>
            )}
            {editorType === "spreadsheet" && (
              <MenubarItem onClick={() => handleInsert("chart")}>
                <SquareStack className="h-4 w-4 mr-2" />
                Chart
              </MenubarItem>
            )}
            {editorType === "document" && (
              <MenubarItem onClick={() => handleInsert("checkbox")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Checkbox
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={toggleToolbar}>
              {toolbarCollapsed ? "Show Toolbar" : "Hide Toolbar"}
            </MenubarItem>
            <MenubarItem onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </MenubarItem>
            <MenubarItem onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Full Screen
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Create</MenubarTrigger>
          <MenubarContent>
            {Object.entries(editorRoutes).map(([type, route]) => (
              type !== editorType && (
                <MenubarItem key={type} asChild>
                  <Link to={route}>
                    {getEditorIcon(type as "document" | "spreadsheet" | "presentation")}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Link>
                </MenubarItem>
              )
            ))}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleHelp}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Documentation
            </MenubarItem>
            <MenubarItem>
              Keyboard Shortcuts
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              About tizu
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Ribbon toolbar */}
      <Collapsible
        open={!toolbarCollapsed}
        className="w-full border-b border-border"
      >
        <CollapsibleContent className="p-1">
          <div className="flex flex-wrap items-center gap-1 px-1 py-1">
            {/* Main toolbar sections */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8" onClick={handleUndo}>
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8" onClick={handleRedo}>
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Edit</span>
            </div>

            <div className="h-10 w-[1px] bg-border mx-1"></div>

            {/* Font Section */}
            <div className="p-0.5 rounded">
              <FontLibrary
                onFontChange={onFontChange}
                onFontSizeChange={onFontSizeChange}
                currentFont={currentFont}
                currentSize={currentSize}
                isMobile={isMobile}
              />
            </div>

            <div className="h-10 w-[1px] bg-border mx-1"></div>

            {/* Text Formatting */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onStyleClick("bold")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onStyleClick("italic")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onStyleClick("underline")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Format</span>
            </div>

            {/* Alignment */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onAlignClick("left")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onAlignClick("center")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onAlignClick("right")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onAlignClick("justify")}
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Justify</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Align</span>
            </div>

            {/* Lists */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onListClick("bullet")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => onListClick("numbered")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Lists</span>
            </div>

            <div className="h-10 w-[1px] bg-border mx-1"></div>

            {/* Insert Section */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => handleInsert("image")}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => handleInsert("table")}
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
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={() => handleInsert("link")}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Link</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Insert</span>
            </div>

            {/* Type-specific Insert options */}
            {editorType === "presentation" && (
              <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 mb-1" 
                      onClick={() => handleInsert("slide")}
                    >
                      <SquareStack className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Slide</TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground">Slide</span>
              </div>
            )}

            {editorType === "spreadsheet" && (
              <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 mb-1" 
                      onClick={() => handleInsert("chart")}
                    >
                      <SquareStack className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Chart</TooltipContent>
                </Tooltip>
                <span className="text-xs text-muted-foreground">Chart</span>
              </div>
            )}

            <div className="h-10 w-[1px] bg-border mx-1"></div>

            {/* Zoom controls */}
            <div className="flex flex-col items-center p-0.5 rounded hover:bg-accent">
              <div className="flex items-center gap-1 mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>
                <span className="text-xs px-1">{zoomLevel}%</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-xs text-muted-foreground">Zoom</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSave} className="gap-1">
                <Save className="h-4 w-4" />
                Save
              </Button>
              
              <Button variant="outline" size="sm" onClick={onShare} className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {fileExtensions[editorType].map((ext) => (
                    <DropdownMenuItem 
                      key={ext.value} 
                      onClick={() => onDownload(ext.value)}
                    >
                      {ext.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger asChild className="flex justify-center border-t border-border">
          <Button variant="ghost" size="sm" className="w-full h-5 rounded-none">
            {toolbarCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
