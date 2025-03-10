
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ArrowLeft, Bold, Download, FileSpreadsheet, FileText, Italic, PresentationIcon, 
  Plus, Save, Settings, Shapes, Square, Circle, Underline, Moon, Sun, Share, 
  History, Copy, Smartphone, Users, Link as LinkIcon, Check, Palette,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Type, Heading1, Heading2,
  Heading3, FilePlus, PageBreak, TableProperties, BookOpen, Printer, FileText2,
  Table2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontLibrary, themes } from "@/components/FontLibrary";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery, useIsMobile } from "@/hooks/use-mobile";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";
import { useTheme } from "@/components/ThemeProvider";
import { useCollaboration } from "@/components/CollaborationProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Document templates
const templates = [
  { id: "blank", name: "Blank Document", content: "" },
  { id: "resume", name: "Resume", content: "# Resume\n\n## Personal Information\nName: Your Name\nEmail: your.email@example.com\nPhone: (123) 456-7890\n\n## Education\n\n## Experience\n\n## Skills" },
  { id: "letter", name: "Business Letter", content: "# Business Letter\n\nYour Name\nYour Address\nCity, State ZIP\n\nDate\n\nRecipient Name\nRecipient Address\nCity, State ZIP\n\nDear Recipient,\n\n[Letter Body]\n\nSincerely,\n\nYour Name" },
  { id: "report", name: "Report", content: "# Report Title\n\n## Executive Summary\n\n## Introduction\n\n## Findings\n\n## Conclusion\n\n## Recommendations" },
  { id: "coverpage", name: "Cover Page", content: "# [Document Title]\n\n## [Subtitle or Tagline]\n\n### Prepared by: [Your Name]\n\n**Date:** [Current Date]\n\n**Contact Information:**\n- Email: your.email@example.com\n- Phone: (123) 456-7890\n\n---\n\n*[Optional organizational logo or affiliation]*" }
];

// Heading styles
const headingStyles = [
  { id: "normal", name: "Normal", class: "text-base" },
  { id: "heading1", name: "Heading 1", class: "text-3xl font-bold" },
  { id: "heading2", name: "Heading 2", class: "text-2xl font-bold" },
  { id: "heading3", name: "Heading 3", class: "text-xl font-bold" },
  { id: "subtitle", name: "Subtitle", class: "text-lg italic" },
];

// Font sizes
const fontSizes = [
  { id: "xs", name: "9", class: "text-xs" },
  { id: "sm", name: "10", class: "text-sm" },
  { id: "base", name: "12", class: "text-base" },
  { id: "lg", name: "14", class: "text-lg" },
  { id: "xl", name: "16", class: "text-xl" },
  { id: "2xl", name: "18", class: "text-2xl" },
  { id: "3xl", name: "24", class: "text-3xl" },
  { id: "4xl", name: "36", class: "text-4xl" },
];

// Font colors
const fontColors = [
  { id: "default", name: "Default", class: "text-foreground" },
  { id: "primary", name: "Primary", class: "text-primary" },
  { id: "secondary", name: "Secondary", class: "text-secondary" },
  { id: "accent", name: "Accent", class: "text-blue-600" },
  { id: "success", name: "Success", class: "text-green-600" },
  { id: "warning", name: "Warning", class: "text-yellow-600" },
  { id: "error", name: "Error", class: "text-red-600" },
  { id: "info", name: "Info", class: "text-sky-600" },
];

// Version history type
interface VersionHistory {
  id: string;
  timestamp: Date;
  title: string;
  content: string;
}

// Page type
interface Page {
  id: string;
  content: string;
  pageNumber: number;
}

const DocumentEditor = () => {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [documentContent, setDocumentContent] = useState("");
  const [documentMode, setDocumentMode] = useState<"edit" | "embedded">("edit");
  const [embeddedContent, setEmbeddedContent] = useState<Array<{type: string, id: string}>>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState("blank");
  const [currentFont, setCurrentFont] = useState("inter");
  const [currentFontSize, setCurrentFontSize] = useState("text-base");
  const [currentFontColor, setCurrentFontColor] = useState("text-foreground");
  const [currentHeadingStyle, setCurrentHeadingStyle] = useState("normal");
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [docIdToJoin, setDocIdToJoin] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<string[]>([]);
  const [pages, setPages] = useState<Page[]>([
    { id: "page-1", content: "", pageNumber: 1 }
  ]);
  const [currentPage, setCurrentPage] = useState<string>("page-1");
  const [showToc, setShowToc] = useState(false);
  
  const isMobile = useIsMobile();
  const [toolbarCollapsed, setToolbarCollapsed] = useState(isMobile);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { 
    shareDocument, 
    joinDocument, 
    updateDocument, 
    currentUsers, 
    isCollaborating,
    documentId
  } = useCollaboration();
  
  const location = useLocation();

  // Check for collaboration parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shareId = params.get("share");
    
    if (shareId) {
      setDocIdToJoin(shareId);
      setJoinDialogOpen(true);
    }
  }, [location]);

  // Initialize version history with first version
  useEffect(() => {
    if (versionHistory.length === 0) {
      saveVersion();
    }
  }, []);
  
  // Sync document changes when collaborating
  useEffect(() => {
    if (isCollaborating) {
      updateDocument(documentTitle, documentContent);
    }
  }, [documentTitle, documentContent, isCollaborating]);

  // Update word count
  useEffect(() => {
    countWords();
    extractTableOfContents();
  }, [documentContent]);

  const countWords = () => {
    const text = documentContent.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    setWordCount(wordCount);
  };

  const extractTableOfContents = () => {
    const headingRegex = /^(#+ )(.*?)$/gm;
    const headings: string[] = [];
    let match;
    
    while ((match = headingRegex.exec(documentContent)) !== null) {
      // Count the number of # characters to determine heading level
      const level = match[1].trim().length;
      const text = match[2];
      headings.push(`${'  '.repeat(level-1)}${level}. ${text}`);
    }
    
    setTableOfContents(headings);
  };

  const handleSave = () => {
    saveVersion();
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully",
    });
  };

  const saveVersion = () => {
    const newVersion: VersionHistory = {
      id: `version-${Date.now()}`,
      timestamp: new Date(),
      title: documentTitle,
      content: documentContent
    };
    
    setVersionHistory(prev => [...prev, newVersion]);
  };

  const restoreVersion = (version: VersionHistory) => {
    setDocumentTitle(version.title);
    setDocumentContent(version.content);
    
    toast({
      title: "Version restored",
      description: `Restored to version from ${version.timestamp.toLocaleString()}`,
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setDocumentContent(template.content);
      setActiveTemplate(templateId);
      toast({
        title: "Template applied",
        description: `Applied ${template.name} template`,
      });
    }
  };

  const downloadDocument = (format: string) => {
    let filename = `${documentTitle}`;
    let mimeType = "text/plain";
    let fileExtension = ".txt";
    
    switch (format) {
      case "pdf":
        mimeType = "application/pdf";
        fileExtension = ".pdf";
        break;
      case "doc":
        mimeType = "application/msword";
        fileExtension = ".doc";
        break;
      case "txt":
      default:
        mimeType = "text/plain";
        fileExtension = ".txt";
    }

    const element = document.createElement("a");
    const file = new Blob([documentContent], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Document downloaded",
      description: `Your document has been downloaded as a ${format.toUpperCase()} file`,
    });
  };

  const printDocument = () => {
    // Create a new window with formatted content
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const content = documentContent
        .replace(/\n/g, '<br/>')
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { font-family: ${currentFont}, sans-serif; margin: 1in; }
              h1 { font-size: 24pt; }
              h2 { font-size: 16pt; }
              h3 { font-size: 14pt; }
              .page-number { text-align: center; font-size: 9pt; color: #777; }
              .page-break { page-break-after: always; }
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            <div>${content}</div>
            <div class="page-number">Page 1</div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for the document to fully load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const addShape = (shape: string) => {
    setSelectedShape(shape);
    const shapeText = shape === "square" ? "□ " : shape === "circle" ? "○ " : "△ ";
    setDocumentContent(prevContent => prevContent + shapeText);
    toast({
      title: "Shape added",
      description: `Added ${shape} to your document`,
    });
  };

  const embedContent = (type: string) => {
    const id = `embedded-${type}-${Date.now()}`;
    setEmbeddedContent([...embeddedContent, { type, id }]);
    setDocumentMode("embedded");
    toast({
      title: "Content embedded",
      description: `Added ${type === "spreadsheet" ? "spreadsheet" : "presentation"} to your document`,
    });
  };

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
  };

  const handleFontSizeChange = (size: string) => {
    setCurrentFontSize(size);
  };
  
  const handleFontColorChange = (color: string) => {
    setCurrentFontColor(color);
  };
  
  const handleHeadingStyleChange = (style: string) => {
    setCurrentHeadingStyle(style);
    
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const selectedText = documentContent.substring(start, end);
      
      let newText;
      
      if (style === "normal") {
        // Remove markdown heading indicators from selected text
        newText = selectedText.replace(/^#+\s*/gm, '');
      } else if (style === "heading1") {
        newText = `# ${selectedText.replace(/^#+\s*/gm, '')}`;
      } else if (style === "heading2") {
        newText = `## ${selectedText.replace(/^#+\s*/gm, '')}`;
      } else if (style === "heading3") {
        newText = `### ${selectedText.replace(/^#+\s*/gm, '')}`;
      } else if (style === "subtitle") {
        newText = `#### ${selectedText.replace(/^#+\s*/gm, '')}`;
      }
      
      const newContent = 
        documentContent.substring(0, start) + 
        newText + 
        documentContent.substring(end);
      
      setDocumentContent(newContent);
      
      // Re-extract table of contents after changing headings
      setTimeout(extractTableOfContents, 0);
    }
  };

  const generateShareLink = () => {
    if (isCollaborating && documentId) {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/document?share=${documentId}`;
      setShareLink(link);
      return link;
    } else {
      // Create a new shared document
      const docId = shareDocument(documentTitle, documentContent);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/document?share=${docId}`;
      setShareLink(link);
      
      toast({
        title: "Document shared",
        description: "Anyone with the link can now view and edit this document",
      });
      
      return link;
    }
  };

  const copyShareLink = () => {
    const link = shareLink || generateShareLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleJoinDocument = () => {
    if (docIdToJoin) {
      const success = joinDocument(docIdToJoin, userName);
      
      if (success) {
        setJoinDialogOpen(false);
        toast({
          title: "Document joined",
          description: "You have joined the shared document",
        });
      } else {
        toast({
          title: "Error joining document",
          description: "The document could not be found",
          variant: "destructive",
        });
      }
    }
  };

  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };
  
  const addPageBreak = () => {
    if (textAreaRef.current) {
      const cursorPos = textAreaRef.current.selectionStart;
      const updatedContent = 
        documentContent.substring(0, cursorPos) + 
        "\n\n---PAGE BREAK---\n\n" + 
        documentContent.substring(cursorPos);
      
      setDocumentContent(updatedContent);
      
      toast({
        title: "Page break added",
        description: "A page break has been inserted at the cursor position",
      });
    }
  };
  
  const addNewPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    const newPages = [...pages, { id: newPageId, content: "", pageNumber: pages.length + 1 }];
    setPages(newPages);
    setCurrentPage(newPageId);
    
    toast({
      title: "New page added",
      description: `Added page ${pages.length + 1} to your document`,
    });
  };
  
  const insertTableOfContents = () => {
    const toc = "# Table of Contents\n\n" + tableOfContents.join("\n") + "\n\n---\n\n";
    
    if (textAreaRef.current) {
      const cursorPos = textAreaRef.current.selectionStart;
      const updatedContent = 
        documentContent.substring(0, cursorPos) + 
        toc + 
        documentContent.substring(cursorPos);
      
      setDocumentContent(updatedContent);
      
      toast({
        title: "Table of contents added",
        description: "A table of contents has been inserted",
      });
    }
  };
  
  const toggleTableOfContents = () => {
    setShowToc(!showToc);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <Input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-lg font-medium border-none focus-visible:ring-0 px-0 h-auto py-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={toggleToolbar}>
                <Smartphone className="h-5 w-5" />
              </Button>
            ) : null}
            
            {isCollaborating && (
              <CollaboratorAvatars users={currentUsers} />
            )}
            
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadDocument("txt")}>Text (.txt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadDocument("doc")}>Word (.doc)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadDocument("pdf")}>PDF (.pdf)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={printDocument}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print document</TooltipContent>
            </Tooltip>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Document</DialogTitle>
                  <DialogDescription>
                    Anyone with the link can view and edit this document.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                  <Input 
                    readOnly 
                    value={shareLink || generateShareLink()} 
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={copyShareLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setShareLink("")}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Shared Document</DialogTitle>
                  <DialogDescription>
                    Enter your name to join this shared document
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docId">Document ID</Label>
                    <Input 
                      id="docId" 
                      value={docIdToJoin} 
                      onChange={(e) => setDocIdToJoin(e.target.value)}
                      placeholder="Document ID" 
                      disabled={!!docIdToJoin}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleJoinDocument}>Join Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setJoinDialogOpen(true)}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Join Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={generateShareLink}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <History className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[300px]">
                <div className="space-y-2">
                  <h3 className="font-medium">Version History</h3>
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {versionHistory.map((version) => (
                      <div key={version.id} className="flex justify-between items-center border rounded-md p-2">
                        <div>
                          <p className="text-sm font-medium">{version.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {version.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => restoreVersion(version)}
                        >
                          Restore
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="font-semibold pt-2 opacity-50">
                  Color Themes
                </DropdownMenuItem>
                {themes.map((themeOption) => (
                  <DropdownMenuItem 
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className="flex items-center justify-between"
                  >
                    {themeOption.label}
                    {theme === themeOption.value && (
                      <Check className="h-4 w-4 ml-2" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Document Settings</SheetTitle>
                  <SheetDescription>
                    Configure your document settings here.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Templates</h3>
                    <Select 
                      value={activeTemplate} 
                      onValueChange={applyTemplate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="dark-mode" 
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Color Theme</h3>
                    <Select 
                      value={theme} 
                      onValueChange={setTheme}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map(themeOption => (
                          <SelectItem key={themeOption.value} value={themeOption.value}>
                            {themeOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className={`border-b border-border bg-muted/30 ${toolbarCollapsed ? 'hidden md:block' : ''}`}>
        <div className="container py-2 flex flex-wrap items-center gap-1 overflow-x-auto">
          <div className="flex flex-wrap items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Text alignment */}
          <div className="flex flex-wrap items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align right</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Lists */}
          <div className="flex flex-wrap items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet list</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered list</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Font selection */}
          <FontLibrary 
            onFontChange={handleFontChange} 
            onFontSizeChange={handleFontSizeChange}
            currentFont={currentFont}
            currentSize={currentFontSize}
            isMobile={isMobile}
          />
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Font size */}
          <Select value={currentFontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map(size => (
                <SelectItem key={size.id} value={size.class}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Font color */}
          <Select value={currentFontColor} onValueChange={handleFontColorChange}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {fontColors.map(color => (
                <SelectItem key={color.id} value={color.class}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${color.class === 'text-foreground' ? 'bg-foreground' : color.class.replace('text-', 'bg-')}`}></div>
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Heading styles */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Type className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Headings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {headingStyles.map(style => (
                <DropdownMenuItem 
                  key={style.id} 
                  onClick={() => handleHeadingStyleChange(style.id)}
                  className={style.class}
                >
                  {style.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Shapes className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Shapes</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addShape("square")}>
                <Square className="h-4 w-4 mr-2" />
                Square
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addShape("circle")}>
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FilePlus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Page</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={addNewPage}>
                <FileText2 className="h-4 w-4 mr-2" />
                New Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addPageBreak}>
                <PageBreak className="h-4 w-4 mr-2" />
                Page Break
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyTemplate("coverpage")}>
                <FileText className="h-4 w-4 mr-2" />
                Cover Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Table2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Insert</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={insertTableOfContents}>
                <BookOpen className="h-4 w-4 mr-2" />
                Table of Contents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => embedContent("spreadsheet")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => embedContent("presentation")}>
                <PresentationIcon className="h-4 w-4 mr-2" />
                Presentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTableOfContents}
            className="gap-1"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Toggle TOC</span>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-muted/20 border-b border-border py-1 px-4 text-xs text-muted-foreground flex justify-between items-center">
        <div>
          Words: {wordCount}
        </div>
        <div>
          Page: {pages.find(p => p.id === currentPage)?.pageNumber || 1} of {pages.length}
        </div>
      </div>

      {/* Editor */}
      <main className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Table of Contents Sidebar (conditionally shown) */}
        {showToc && (
          <div className="md:col-span-1 border rounded-md p-4 h-fit">
            <h3 className="font-medium mb-2">Table of Contents</h3>
            {tableOfContents.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {tableOfContents.map((heading, idx) => (
                  <li key={idx} className="whitespace-pre">{heading}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No headings found</p>
            )}
            <div className="mt-4">
              <Button size="sm" variant="outline" onClick={insertTableOfContents}>Insert into Document</Button>
            </div>
          </div>
        )}
        
        {/* Main Editor Area */}
        <div className={showToc ? "md:col-span-3" : "md:col-span-4"}>
          {documentMode === "edit" ? (
            <Textarea
              ref={textAreaRef}
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              className={`min-h-[calc(100vh-280px)] resize-none border-none focus-visible:ring-0 ${currentFontSize} ${currentFontColor}`}
              placeholder="Start typing your document here..."
              style={{ fontFamily: currentFont }}
            />
          ) : (
            <div className="min-h-[calc(100vh-200px)] border rounded-md p-4">
              <div className={`${currentFontSize} mb-6`} style={{ fontFamily: currentFont }}>
                {documentContent}
              </div>
              
              {embeddedContent.map(content => (
                <div key={content.id} className="border rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Embedded {content.type === "spreadsheet" ? "Spreadsheet" : "Presentation"}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setDocumentMode("edit")}>
                      Return to document
                    </Button>
                  </div>
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    {content.type === "spreadsheet" ? (
                      <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
                    ) : (
                      <PresentationIcon className="h-12 w-12 text-muted-foreground/50" />
                    )}
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={() => setDocumentMode("edit")}>
                <FileText className="h-4 w-4 mr-2" />
                Back to Document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;
