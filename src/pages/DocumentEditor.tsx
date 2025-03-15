
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ArrowLeft, Download, FileSpreadsheet, PresentationIcon, Plus, Save, Settings, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  FileText, ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontLibrary } from "@/components/FontLibrary";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";
import { useCollaboration } from "@/components/CollaborationProvider";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HighContrastToggle } from "@/components/HighContrastToggle";

// Sample collaborators data
const sampleCollaborators = [
  { id: "user1", name: "John Doe", color: "#6366F1" },
  { id: "user2", name: "Jane Smith", color: "#8B5CF6" },
  { id: "user3", name: "Alex Johnson", color: "#EC4899" },
];

const DocumentEditor = () => {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [documentContent, setDocumentContent] = useState("");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedFontSize, setSelectedFontSize] = useState("text-base");
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const { shareDocument, currentUsers, isCollaborating } = useCollaboration();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isMobile = useIsMobile();

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
  };

  const handleSave = () => {
    // In a real app, would save to backend
    if (isCollaborating) {
      // Update the shared document
      shareDocument(documentTitle, documentContent);
    }
    
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully",
    });
  };

  const handleShare = () => {
    const documentId = shareDocument(documentTitle, documentContent);
    
    // Copy sharing link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/document?id=${documentId}`);
    
    toast({
      title: "Document shared",
      description: "Sharing link copied to clipboard",
    });
  };

  const downloadDocument = (format: string) => {
    let filename = `${documentTitle}`;
    let content = documentContent;
    let mimeType = "";
    let fileExtension = "";
    
    switch (format) {
      case "txt":
        mimeType = "text/plain";
        fileExtension = ".txt";
        break;
      case "docx":
        // In a real app, would convert to actual DOCX
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = ".docx";
        break;
      case "pdf":
        // In a real app, would convert to actual PDF
        mimeType = "application/pdf";
        fileExtension = ".pdf";
        break;
    }
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
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
  
  const toggleToolbar = () => {
    setToolbarCollapsed(!toolbarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            {isCollaborating && (
              <CollaboratorAvatars users={currentUsers.length > 0 ? currentUsers : sampleCollaborators} />
            )}
            
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleToolbar}>
                <Plus className="h-5 w-5" />
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
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
                <DropdownMenuItem onClick={() => downloadDocument("txt")}>Text (.txt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadDocument("docx")}>Word (.docx)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadDocument("pdf")}>PDF (.pdf)</DropdownMenuItem>
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
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                        aria-label="Toggle dark mode"
                      />
                      <Moon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>High Contrast</span>
                    <HighContrastToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className={`border-b border-border bg-muted/30 ${toolbarCollapsed ? 'hidden' : 'block'}`}>
        <div className="container py-2 flex flex-wrap items-center gap-2">
          {/* Text formatting */}
          <div className="flex items-center gap-1 mr-2">
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
          
          {/* Text alignment */}
          <div className="flex items-center gap-1 mr-2">
            <Button variant="ghost" size="sm">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Lists */}
          <div className="flex items-center gap-1 mr-2">
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          {/* Font controls */}
          <FontLibrary
            onFontChange={handleFontChange}
            onFontSizeChange={handleFontSizeChange}
            currentFont={selectedFont}
            currentSize={selectedFontSize}
            isMobile={isMobile}
          />
          
          <div className="ml-auto" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/spreadsheet">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Spreadsheet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/presentation">
                  <PresentationIcon className="h-4 w-4 mr-2" />
                  Presentation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document editor */}
      <main className="flex-1 container py-6">
        <div className={`max-w-4xl mx-auto bg-card rounded-lg shadow-sm border p-8 min-h-[60vh] ${selectedFontSize}`} style={{ fontFamily: selectedFont }}>
          <Textarea
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            className="border-none resize-none w-full h-full min-h-[60vh] focus-visible:ring-0 p-0 text-card-foreground"
            placeholder="Start typing your document here..."
          />
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;
