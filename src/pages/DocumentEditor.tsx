import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Bold, Download, FileSpreadsheet, FileText, Italic, PresentationIcon, Plus, Save, Settings, Shapes, Square, Circle, Underline, Moon, Sun, Share, History, Copy, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontSelector } from "@/components/FontSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-mobile";

// Document templates
const templates = [
  { id: "blank", name: "Blank Document", content: "" },
  { id: "resume", name: "Resume", content: "# Resume\n\n## Personal Information\nName: Your Name\nEmail: your.email@example.com\nPhone: (123) 456-7890\n\n## Education\n\n## Experience\n\n## Skills" },
  { id: "letter", name: "Business Letter", content: "# Business Letter\n\nYour Name\nYour Address\nCity, State ZIP\n\nDate\n\nRecipient Name\nRecipient Address\nCity, State ZIP\n\nDear Recipient,\n\n[Letter Body]\n\nSincerely,\n\nYour Name" },
  { id: "report", name: "Report", content: "# Report Title\n\n## Executive Summary\n\n## Introduction\n\n## Findings\n\n## Conclusion\n\n## Recommendations" }
];

// Version history type
interface VersionHistory {
  id: string;
  timestamp: Date;
  title: string;
  content: string;
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [shareLink, setShareLink] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [toolbarCollapsed, setToolbarCollapsed] = useState(isMobile);

  // Apply dark mode class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize version history with first version
  useEffect(() => {
    if (versionHistory.length === 0) {
      saveVersion();
    }
  }, []);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareId = Date.now().toString(36);
    const link = `${baseUrl}/document?share=${shareId}&title=${encodeURIComponent(documentTitle)}`;
    setShareLink(link);
    
    // In a real app, you would save the document to a server here
    // For demonstration, we're just generating a fake share link
    
    return link;
  };

  const copyShareLink = () => {
    const link = shareLink || generateShareLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="border-b border-border">
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
                    Anyone with the link can view this document.
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
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className={`border-b border-border bg-muted/30 ${toolbarCollapsed ? 'hidden md:block' : ''}`}>
        <div className="container py-2 flex flex-wrap items-center gap-1">
          <div className="flex flex-wrap items-center gap-1 mr-2">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <FontSelector 
            onFontChange={handleFontChange} 
            onFontSizeChange={handleFontSizeChange}
            currentFont={currentFont}
            currentSize={currentFontSize}
          />
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Shapes className="h-4 w-4 mr-1" />
                Shapes
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
                <Plus className="h-4 w-4 mr-1" />
                Embed
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </div>
      </div>

      {/* Editor */}
      <main className="flex-1 container py-6">
        {documentMode === "edit" ? (
          <Textarea
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            className={`min-h-[calc(100vh-200px)] resize-none border-none focus-visible:ring-0 ${currentFontSize}`}
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
      </main>
    </div>
  );
};

export default DocumentEditor;
