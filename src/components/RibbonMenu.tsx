
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
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontLibrary } from "@/components/FontLibrary";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

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

  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };

  const handleInsert = (type: string) => {
    onInsert(type);
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

  return (
    <div className="flex flex-col">
      {/* Main menubar */}
      <Menubar className="rounded-none border-b border-t-0 border-l-0 border-r-0 px-2">
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
            <MenubarItem>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
            </MenubarItem>
            <MenubarItem>
              Redo
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut
            </MenubarItem>
            <MenubarItem>
              Copy
            </MenubarItem>
            <MenubarItem>
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
                    {type === "document" && <FileText className="h-4 w-4 mr-2" />}
                    {type === "spreadsheet" && <FileSpreadsheet className="h-4 w-4 mr-2" />}
                    {type === "presentation" && <PresentationIcon className="h-4 w-4 mr-2" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Link>
                </MenubarItem>
              )
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Ribbon toolbar */}
      <div className={`ribbon-container ${toolbarCollapsed ? 'hidden' : 'block'}`}>
        <div className="ribbon-wrapper">
          {/* Formatting group */}
          <div className="ribbon-group">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStyleClick("bold")}
              className="w-9 px-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStyleClick("italic")}
              className="w-9 px-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onStyleClick("underline")}
              className="w-9 px-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="ribbon-divider" />
          
          {/* Alignment group */}
          <div className="ribbon-group">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onAlignClick("left")}
              className="w-9 px-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onAlignClick("center")}
              className="w-9 px-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onAlignClick("right")}
              className="w-9 px-0"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onAlignClick("justify")}
              className="w-9 px-0"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="ribbon-divider" />
          
          {/* Lists group */}
          <div className="ribbon-group">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onListClick("bullet")}
              className="w-9 px-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onListClick("numbered")}
              className="w-9 px-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="ribbon-divider" />
          
          {/* Font controls */}
          <FontLibrary
            onFontChange={onFontChange}
            onFontSizeChange={onFontSizeChange}
            currentFont={currentFont}
            currentSize={currentSize}
            isMobile={isMobile}
          />
          
          <div className="ml-auto" />
          
          {/* Quick actions */}
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
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
        </div>
      </div>
    </div>
  );
}
