import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, Settings, Trash, Shapes, Circle, Square, Triangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { useCollaboration } from "@/components/CollaborationProvider";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";
import { RibbonMenu } from "@/components/RibbonMenu";
import { AppLogo } from "@/components/AppLogo";
import { AppFooter } from "@/components/AppFooter";

interface Slide {
  id: string;
  title: string;
  content: string;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  shapes: Array<{ type: string; position: { x: number; y: number } }>;
}

const templates = [
  { 
    id: "blank", 
    name: "Blank Presentation", 
    slides: [{ id: "slide-1", title: "Slide 1", content: "Your content here...", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] }] 
  },
  {
    id: "business", 
    name: "Business Presentation", 
    slides: [
      { id: "slide-1", title: "Company Overview", content: "Insert your company description here", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-2", title: "Products & Services", content: "List your key products and services", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-3", title: "Market Analysis", content: "Share insights about your target market", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-4", title: "Financial Projections", content: "Present your financial forecasts", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-5", title: "Next Steps", content: "Outline the path forward", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] }
    ]
  },
  {
    id: "educational", 
    name: "Educational Presentation", 
    slides: [
      { id: "slide-1", title: "Topic Introduction", content: "Introduce the main concept", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-2", title: "Key Points", content: "List the main learning objectives", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-3", title: "Examples", content: "Provide practical examples", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-4", title: "Summary", content: "Recap the key takeaways", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] },
      { id: "slide-5", title: "Questions & Discussion", content: "Open the floor for questions", fontFamily: "inter", fontSize: "text-base", fontColor: "text-foreground", shapes: [] }
    ]
  }
];

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

const sampleCollaborators = [
  { id: "user1", name: "John Doe", color: "#6366F1" },
  { id: "user2", name: "Jane Smith", color: "#8B5CF6" },
  { id: "user3", name: "Alex Johnson", color: "#EC4899" },
];

const PresentationEditor = () => {
  const [presentationTitle, setPresentationTitle] = useState("Untitled Presentation");
  const [slides, setSlides] = useState<Slide[]>([
    { 
      id: "slide-1", 
      title: "Slide 1", 
      content: "Your content here...", 
      fontFamily: "inter", 
      fontSize: "text-base", 
      fontColor: "text-foreground", 
      shapes: [] 
    }
  ]);
  const [activeSlide, setActiveSlide] = useState("slide-1");
  const [activeTemplate, setActiveTemplate] = useState("blank");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const { shareDocument, currentUsers, isCollaborating } = useCollaboration();

  const addSlide = () => {
    const newSlideId = `slide-${slides.length + 1}`;
    const newSlide = {
      id: newSlideId,
      title: `Slide ${slides.length + 1}`,
      content: "Your content here...",
      fontFamily: "inter", 
      fontSize: "text-base", 
      fontColor: "text-foreground",
      shapes: []
    };
    setSlides([...slides, newSlide]);
    setActiveSlide(newSlideId);
  };

  const removeSlide = (id: string) => {
    if (slides.length === 1) {
      toast({
        title: "Cannot remove slide",
        description: "Presentation must have at least one slide",
        variant: "destructive"
      });
      return;
    }
    
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
    
    if (id === activeSlide) {
      setActiveSlide(newSlides[0].id);
    }
  };

  const updateSlideContent = (id: string, content: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, content } : slide
    ));
  };

  const updateSlideTitle = (id: string, title: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, title } : slide
    ));
  };
  
  const updateSlideFontFamily = (id: string, fontFamily: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, fontFamily } : slide
    ));
  };
  
  const updateSlideFontSize = (id: string, fontSize: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, fontSize } : slide
    ));
  };
  
  const updateSlideFontColor = (id: string, fontColor: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, fontColor } : slide
    ));
  };

  const addShape = (id: string, shapeType: string) => {
    setSlides(slides.map(slide => 
      slide.id === id 
        ? { 
            ...slide, 
            shapes: [...slide.shapes, { 
              type: shapeType, 
              position: { x: 50, y: 50 } 
            }] 
          } 
        : slide
    ));
    
    const slideIndex = slides.findIndex(slide => slide.id === id);
    if (slideIndex !== -1) {
      const shapeText = shapeType === "square" ? "□ " : shapeType === "circle" ? "○ " : "△ ";
      updateSlideContent(id, slides[slideIndex].content + "\n\n" + shapeText + " Shape added");
    }
    
    toast({
      title: "Shape added",
      description: `Added ${shapeType} to your slide`,
    });
  };

  const handleSave = () => {
    if (isCollaborating) {
      shareDocument(presentationTitle, JSON.stringify(slides));
    }
    
    toast({
      title: "Presentation saved",
      description: "Your presentation has been saved successfully",
    });
  };

  const handleShare = () => {
    const documentId = shareDocument(presentationTitle, JSON.stringify(slides));
    
    navigator.clipboard.writeText(`${window.location.origin}/presentation?id=${documentId}`);
    
    toast({
      title: "Presentation shared",
      description: "Sharing link copied to clipboard",
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSlides([...template.slides]);
      setActiveSlide(template.slides[0].id);
      setActiveTemplate(templateId);
      toast({
        title: "Template applied",
        description: `Applied ${template.name} template`,
      });
    }
  };

  const downloadPresentation = (format: string) => {
    let filename = `${presentationTitle}`;
    let content = "";
    let mimeType = "";
    let fileExtension = "";
    
    switch (format) {
      case "pptx":
        content = slides.map(slide => 
          `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
        ).join("");
        mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        fileExtension = ".pptx";
        break;
      case "pdf":
        content = slides.map(slide => 
          `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
        ).join("");
        mimeType = "application/pdf";
        fileExtension = ".pdf";
        break;
      case "jpg":
        toast({
          title: "Feature coming soon",
          description: "JPG export will be available in the next update",
        });
        return;
      case "txt":
      default:
        content = slides.map(slide => 
          `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
        ).join("");
        mimeType = "text/plain";
        fileExtension = ".txt";
    }
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Presentation downloaded",
      description: `Your presentation has been downloaded as a ${format.toUpperCase()} file`,
    });
  };

  const handleFontChange = (font: string) => {
    updateSlideFontFamily(activeSlide, font);
  };

  const handleFontSizeChange = (size: string) => {
    updateSlideFontSize(activeSlide, size);
  };
  
  const handleStyleClick = (style: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = slides.find(s => s.id === activeSlide)?.content.substring(start, end) || '';
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
    
    const slide = slides.find(s => s.id === activeSlide);
    if (slide) {
      const newContent = 
        slide.content.substring(0, start) + 
        newText + 
        slide.content.substring(end);
      
      updateSlideContent(activeSlide, newContent);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start, start + newText.length);
        }
      }, 0);
    }
    
    toast({
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} applied`,
      description: `Text formatted with ${style}`,
    });
  };
  
  const handleAlignClick = (align: string) => {
    toast({
      title: `Text aligned ${align}`,
      description: `Slide alignment set to ${align}`,
    });
  };
  
  const handleListClick = (listType: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const slide = slides.find(s => s.id === activeSlide);
    
    if (!slide) return;
    
    const selectedText = slide.content.substring(start, end);
    const lines = selectedText.split('\n');
    let newText = '';
    
    if (listType === 'bullet') {
      newText = lines.map(line => `• ${line}`).join('\n');
    } else if (listType === 'numbered') {
      newText = lines.map((line, i) => `${i+1}. ${line}`).join('\n');
    }
    
    const newContent = 
      slide.content.substring(0, start) + 
      newText + 
      slide.content.substring(end);
    
    updateSlideContent(activeSlide, newContent);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(start, start + newText.length);
      }
    }, 0);
    
    toast({
      title: `${listType === 'bullet' ? 'Bullet' : 'Numbered'} list applied`,
      description: `Added ${listType} list formatting`,
    });
  };
  
  const handleInsert = (type: string) => {
    if (type === 'slide') {
      addSlide();
    } else if (type === 'image' || type === 'table' || type === 'link') {
      if (!editorRef.current) return;
      
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const slide = slides.find(s => s.id === activeSlide);
      
      if (!slide) return;
      
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
        default:
          insertText = '';
      }
      
      const newContent = 
        slide.content.substring(0, start) + 
        insertText + 
        slide.content.substring(start);
      
      updateSlideContent(activeSlide, newContent);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start, start + insertText.length);
        }
      }, 0);
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} inserted`,
        description: `Added ${type} to your slide`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
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
                  <SheetTitle>Presentation Settings</SheetTitle>
                  <SheetDescription>
                    Configure your presentation settings here.
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
                  <div>
                    <h3 className="text-sm font-medium mb-2">Text Color</h3>
                    <Select 
                      value={slides.find(s => s.id === activeSlide)?.fontColor || "text-foreground"}
                      onValueChange={(val) => updateSlideFontColor(activeSlide, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
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
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <RibbonMenu 
        editorType="presentation"
        currentFont={slides.find(s => s.id === activeSlide)?.fontFamily || "inter"}
        currentSize={slides.find(s => s.id === activeSlide)?.fontSize || "text-base"}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        onStyleClick={handleStyleClick}
        onAlignClick={handleAlignClick}
        onListClick={handleListClick}
        onSave={handleSave}
        onShare={handleShare}
        onDownload={downloadPresentation}
        onInsert={handleInsert}
      />

      <div className="border-b border-border bg-muted/30">
        <div className="container py-2 flex items-center gap-2">
          <span className="text-sm font-medium">Shapes:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addShape(activeSlide, "square")}>
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Square</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addShape(activeSlide, "circle")}>
                <Circle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addShape(activeSlide, "triangle")}>
                <Triangle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Triangle</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" onClick={addSlide}>
            Add Slide
          </Button>
        </div>
      </div>

      <main className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 border rounded-md overflow-hidden">
          <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
            <h3 className="font-medium">Slides</h3>
            <Button size="sm" variant="ghost" onClick={addSlide}>
              Add
            </Button>
          </div>
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {slides.map((slide) => (
              <div 
                key={slide.id}
                className={`
                  p-3 rounded-md cursor-pointer flex justify-between items-center
                  ${activeSlide === slide.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'}
                `}
                onClick={() => setActiveSlide(slide.id)}
              >
                <span className="text-sm font-medium truncate">{slide.title}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(slide.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 border rounded-md overflow-hidden">
          <Tabs defaultValue="edit" className="w-full">
            <div className="border-b px-4">
              <TabsList className="mx-0 mt-2 mb-2 bg-transparent h-9 border">
                <TabsTrigger value="edit" className="h-8">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="h-8">Preview</TabsTrigger>
              </TabsList>
            </div>
            
            {slides.map((slide) => {
              if (slide.id === activeSlide) {
                return (
                  <div key={slide.id}>
                    <TabsContent value="edit" className="p-4 space-y-4 mt-0">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Slide Title</label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateSlideTitle(slide.id, e.target.value)}
                          className="text-base font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Slide Content</label>
                        <Textarea
                          ref={editorRef}
                          value={slide.content}
                          onChange={(e) => updateSlideContent(slide.id, e.target.value)}
                          className={`min-h-[250px] text-base ${slide.fontSize} ${slide.fontColor}`}
                          style={{ fontFamily: slide.fontFamily }}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="mt-0">
                      <div className="border-b bg-muted/30 p-3">
                        <h3 className="text-sm font-medium">Slide Preview</h3>
                      </div>
                      <div className="p-8 flex items-center justify-center min-h-[400px]">
                        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-10 border">
                          <h2 className="text-2xl font-bold mb-6">{slide.title}</h2>
                          <p 
                            className={`whitespace-pre-line ${slide.fontSize} ${slide.fontColor}`}
                            style={{ fontFamily: slide.fontFamily }}
                          >
                            {slide.content}
                          </p>
                          
                          {

