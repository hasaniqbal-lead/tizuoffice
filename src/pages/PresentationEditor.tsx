
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Plus, Save, Settings, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface Slide {
  id: string;
  title: string;
  content: string;
}

const PresentationEditor = () => {
  const [presentationTitle, setPresentationTitle] = useState("Untitled Presentation");
  const [slides, setSlides] = useState<Slide[]>([
    { id: "slide-1", title: "Slide 1", content: "Your content here..." }
  ]);
  const [activeSlide, setActiveSlide] = useState("slide-1");

  const addSlide = () => {
    const newSlideId = `slide-${slides.length + 1}`;
    const newSlide = {
      id: newSlideId,
      title: `Slide ${slides.length + 1}`,
      content: "Your content here..."
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

  const handleSave = () => {
    toast({
      title: "Presentation saved",
      description: "Your presentation has been saved successfully",
    });
  };

  const downloadPresentation = () => {
    // Create a simple text representation of the presentation
    const content = slides.map(slide => 
      `# ${slide.title}\n\n${slide.content}\n\n---\n\n`
    ).join("");
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${presentationTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Presentation downloaded",
      description: "Your presentation has been downloaded as a text file",
    });
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
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPresentation}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
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
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">More settings coming soon</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Presentation editor */}
      <main className="flex-1 container py-6 grid grid-cols-4 gap-6">
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
                          className="min-h-[250px] text-base"
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
                          <p className="whitespace-pre-line">{slide.content}</p>
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
