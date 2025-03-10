
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Download, FileSpreadsheet, FileText, Plus, Save, Settings, 
  Shapes, Circle, Square, Triangle, Trash, Bold, Italic, Underline, Type, 
  AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface Slide {
  id: string;
  title: string;
  content: string;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  shapes: Array<{ type: string; position: { x: number; y: number } }>;
}

// Presentation templates
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

// Font families
const fontFamilies = [
  { id: "inter", name: "Inter", class: "inter" },
  { id: "roboto", name: "Roboto", class: "roboto" },
  { id: "lato", name: "Lato", class: "lato" },
  { id: "montserrat", name: "Montserrat", class: "montserrat" },
  { id: "merriweather", name: "Merriweather", class: "merriweather" },
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
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  
  const isMobile = useIsMobile();

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
    
    // Set active slide to first one if the active slide was removed
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
    
    // Also add a shape marker to the content
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
    toast({
      title: "Presentation saved",
      description: "Your presentation has been saved successfully",
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
      case "ppt":
        // In a real app, would generate actual PPT content
        content = slides.map(slide => 
          `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
        ).join("");
        mimeType = "application/vnd.ms-powerpoint";
        fileExtension = ".ppt";
        break;
      case "pdf":
        // In a real app, would generate actual PDF content
        content = slides.map(slide => 
          `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
        ).join("");
        mimeType = "application/pdf";
        fileExtension = ".pdf";
        break;
      case "jpg":
        // For demo purposes, just notify that this would normally generate images
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
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                className="text-lg font-medium border-none focus-visible:ring-0 px-0 h-auto py-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleToolbar}>
                <Plus className="h-5 w-5" />
              </Button>
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
                <DropdownMenuItem onClick={() => downloadPresentation("txt")}>Text (.txt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPresentation("ppt")}>PowerPoint (.ppt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPresentation("pdf")}>PDF (.pdf)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPresentation("jpg")}>JPEG Slides (.jpg)</DropdownMenuItem>
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
          <div className="flex items-center gap-1 mr-2">
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
          
          {/* Font family */}
          <Select 
            value={slides.find(s => s.id === activeSlide)?.fontFamily || "inter"}
            onValueChange={(val) => updateSlideFontFamily(activeSlide, val)}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map(font => (
                <SelectItem key={font.id} value={font.class}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Font size */}
          <Select 
            value={slides.find(s => s.id === activeSlide)?.fontSize || "text-base"}
            onValueChange={(val) => updateSlideFontSize(activeSlide, val)}
          >
            <SelectTrigger className="w-[80px] h-8">
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
          
          {/* Font color */}
          <Select 
            value={slides.find(s => s.id === activeSlide)?.fontColor || "text-foreground"}
            onValueChange={(val) => updateSlideFontColor(activeSlide, val)}
          >
            <SelectTrigger className="w-[120px] h-8">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Shapes className="h-4 w-4 mr-1" />
                Shapes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addShape(activeSlide, "square")}>
                <Square className="h-4 w-4 mr-2" />
                Square
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addShape(activeSlide, "circle")}>
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addShape(activeSlide, "triangle")}>
                <Triangle className="h-4 w-4 mr-2" />
                Triangle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/document">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/spreadsheet">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Spreadsheet
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Presentation editor */}
      <main className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Slides list */}
        <div className="col-span-1 border rounded-md overflow-hidden">
          <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
            <h3 className="font-medium">Slides</h3>
            <Button size="sm" variant="ghost" onClick={addSlide}>
              <Plus className="h-4 w-4" />
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

        {/* Active slide editor */}
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
                          
                          {/* We would render actual shapes here with proper positioning in a real app */}
                          {slide.shapes.length > 0 && (
                            <div className="mt-4">
                              <div className="flex gap-2 flex-wrap">
                                {slide.shapes.map((shape, idx) => (
                                  <div key={idx} className="inline-block text-xl">
                                    {shape.type === "square" ? "□" : shape.type === "circle" ? "○" : "△"}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                );
              }
              return null;
            })}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PresentationEditor;
