
import { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { AppFooter } from "@/components/AppFooter";
import { TopRibbon } from "@/components/document/TopRibbon";
import { LeftSidebar } from "@/components/document/LeftSidebar";
import { RightSidebar } from "@/components/document/RightSidebar";
import { NoteCanvas } from "@/components/document/NoteCanvas";
import { DocumentHeader } from "@/components/document/DocumentHeader";
import { useCollaboration } from "@/components/CollaborationProvider";

const DocumentEditor = () => {
  const [documentTitle, setDocumentTitle] = useState("Untitled Note");
  const [documentContent, setDocumentContent] = useState("");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedFontSize, setSelectedFontSize] = useState("text-base");
  const [activeStyle, setActiveStyle] = useState<string | undefined>();
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const { shareDocument, isCollaborating } = useCollaboration();
  
  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    toast({
      title: "Font changed",
      description: `Font changed to ${font}`,
    });
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    // Find the numeric size for the toast
    const numericSize = size.includes("text-[") 
      ? size.match(/\d+/)?.[0]
      : size.replace("text-", "");
    
    toast({
      title: "Font size changed",
      description: `Font size changed to ${numericSize}`,
    });
  };

  const handleSave = () => {
    if (isCollaborating) {
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

  const handlePrint = () => {
    window.print();
    
    toast({
      title: "Print document",
      description: "Print dialog opened",
    });
  };

  const handleStyleClick = (style: string) => {
    setActiveStyle(style);
    
    // Reset after applying style
    setTimeout(() => {
      setActiveStyle(undefined);
    }, 100);
  };
  
  const handleInsert = (type: string) => {
    if (type === "table") {
      const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
      setDocumentContent(prev => prev + tableTemplate);
      
      toast({
        title: "Table inserted",
        description: "A table has been added to your document",
      });
    } else if (type === "pageBreak") {
      setDocumentContent(prev => prev + "\n\n<page-break>\n\n");
      
      toast({
        title: "Page break inserted",
        description: "A page break has been added to your document",
      });
    } else if (type === "image") {
      setDocumentContent(prev => prev + "\n\n[Image Placeholder]\n\n");
      
      toast({
        title: "Image placeholder inserted",
        description: "An image placeholder has been added to your document",
      });
    } else if (type === "checkbox") {
      setDocumentContent(prev => prev + "\n- [ ] New task\n");
      
      toast({
        title: "Checkbox inserted",
        description: "A checkbox has been added to your document",
      });
    }
  };
  
  const handleAddPage = () => {
    setDocumentContent(prev => prev + "\n\n<page-break>\n\n");
    
    toast({
      title: "Page added",
      description: "A new page has been added to your document",
    });
  };

  const handleChangePageSize = (size: string) => {
    setPageSize(size);
    
    toast({
      title: "Page size changed",
      description: `Document page size set to ${size.toUpperCase()}`,
    });
  };

  const handleOrientationChange = (newOrientation: "portrait" | "landscape") => {
    setOrientation(newOrientation);
    
    toast({
      title: "Page orientation changed",
      description: `Document orientation set to ${newOrientation}`,
    });
  };

  return (
    <div className="document-page bg-background">
      <header className="border-b border-border document-header">
        <DocumentHeader 
          documentTitle={documentTitle} 
          onTitleChange={setDocumentTitle} 
        />
      </header>

      <TopRibbon 
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        currentFont={selectedFont}
        currentSize={selectedFontSize}
        onStyleClick={handleStyleClick}
        onInsert={handleInsert}
        orientation={orientation}
        onOrientationChange={handleOrientationChange}
      />

      <div className="document-main">
        <LeftSidebar 
          onAddPage={handleAddPage}
          pageSize={pageSize}
          onChangePageSize={handleChangePageSize}
        />
        
        <div className={`document-content ${pageSize}-page-container`}>
          <NoteCanvas 
            content={documentContent}
            onChange={setDocumentContent}
            fontFamily={selectedFont}
            fontSize={selectedFontSize}
            activeStyle={activeStyle}
            orientation={orientation}
          />
        </div>
        
        <RightSidebar 
          onSave={handleSave}
          onShare={handleShare}
          onPrint={handlePrint}
        />
      </div>

      <AppFooter />
    </div>
  );
};

export default DocumentEditor;
