
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { useCollaboration } from "@/components/CollaborationProvider";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";
import { RibbonMenu } from "@/components/RibbonMenu";
import { AppLogo } from "@/components/AppLogo";
import { AppFooter } from "@/components/AppFooter";

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
  const { shareDocument, currentUsers, isCollaborating } = useCollaboration();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const editorRef = useRef<HTMLTextAreaElement>(null);

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

  const handleStyleClick = (style: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = documentContent.substring(start, end);
    let newText = '';
    
    switch (style) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `_${selectedText}_`;
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = 
      documentContent.substring(0, start) + 
      newText + 
      documentContent.substring(end);
    
    setDocumentContent(newContent);
    
    // Set focus back to textarea and restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    }, 0);
    
    toast({
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} applied`,
      description: `Text formatted with ${style}`,
    });
  };
  
  const handleAlignClick = (align: string) => {
    toast({
      title: `Text aligned ${align}`,
      description: `Document alignment set to ${align}`,
    });
  };
  
  const handleListClick = (listType: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = documentContent.substring(start, end);
    const lines = selectedText.split('\n');
    let newText = '';
    
    if (listType === 'bullet') {
      newText = lines.map(line => `• ${line}`).join('\n');
    } else if (listType === 'numbered') {
      newText = lines.map((line, i) => `${i+1}. ${line}`).join('\n');
    }
    
    const newContent = 
      documentContent.substring(0, start) + 
      newText + 
      documentContent.substring(end);
    
    setDocumentContent(newContent);
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    }, 0);
    
    toast({
      title: `${listType === 'bullet' ? 'Bullet' : 'Numbered'} list applied`,
      description: `Added ${listType} list formatting`,
    });
  };
  
  const handleInsert = (type: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    
    let insertText = '';
    
    switch (type) {
      case 'image':
        insertText = '![Image description](image_url)';
        break;
      case 'table':
        insertText = '\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n';
        break;
      case 'link':
        insertText = '[Link text](https://example.com)';
        break;
      case 'checkbox':
        insertText = '- [ ] Task to complete';
        break;
      default:
        insertText = '';
    }
    
    const newContent = 
      documentContent.substring(0, start) + 
      insertText + 
      documentContent.substring(start);
    
    setDocumentContent(newContent);
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + insertText.length);
    }, 0);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} inserted`,
      description: `Added ${type} to your document`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppLogo />
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

      {/* Ribbon */}
      <RibbonMenu 
        editorType="document"
        currentFont={selectedFont}
        currentSize={selectedFontSize}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        onStyleClick={handleStyleClick}
        onAlignClick={handleAlignClick}
        onListClick={handleListClick}
        onSave={handleSave}
        onShare={handleShare}
        onDownload={downloadDocument}
        onInsert={handleInsert}
      />

      {/* Document editor */}
      <main className="flex-1 container py-6">
        <div className={`max-w-4xl mx-auto bg-card rounded-lg shadow-sm border p-8 min-h-[60vh] ${selectedFontSize}`} style={{ fontFamily: selectedFont }}>
          <Textarea
            ref={editorRef}
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            className="border-none resize-none w-full h-full min-h-[60vh] focus-visible:ring-0 p-0 text-card-foreground"
            placeholder="Start typing your document here..."
          />
        </div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default DocumentEditor;
