
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, FileSpreadsheet, PresentationIcon, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const handleCreateNew = (type: string) => {
    toast({
      title: "Creating new document",
      description: `Starting a new ${type} document`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-4 flex items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bd04e403-b177-48b8-ad6c-a56eddb0f227.png" 
              alt="Tizu Office Logo" 
              className="h-10"
            />
            <h1 className="text-3xl font-bold text-[#8e44ad]">Tizu Office</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-[#8e44ad]">Create New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Document Card */}
            <Card className="transition-all hover:shadow-md border-[#8e44ad]/10 hover:border-[#8e44ad]/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#8e44ad]">
                  <FileText className="h-5 w-5" />
                  Document
                </CardTitle>
                <CardDescription>Create a new text document with templates and embedded content</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <FileText className="h-16 w-16 text-[#8e44ad]/20" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2 bg-[#8e44ad] hover:bg-[#8e44ad]/90">
                  <Link to="/document" onClick={() => handleCreateNew("document")}>
                    <Plus className="h-4 w-4" />
                    Create Document
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Spreadsheet Card */}
            <Card className="transition-all hover:shadow-md border-[#8e44ad]/10 hover:border-[#8e44ad]/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#8e44ad]">
                  <FileSpreadsheet className="h-5 w-5" />
                  Spreadsheet
                </CardTitle>
                <CardDescription>Create a new spreadsheet with formulas and templates</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <FileSpreadsheet className="h-16 w-16 text-[#8e44ad]/20" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2 bg-[#8e44ad] hover:bg-[#8e44ad]/90">
                  <Link to="/spreadsheet" onClick={() => handleCreateNew("spreadsheet")}>
                    <Plus className="h-4 w-4" />
                    Create Spreadsheet
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Presentation Card */}
            <Card className="transition-all hover:shadow-md border-[#8e44ad]/10 hover:border-[#8e44ad]/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#8e44ad]">
                  <PresentationIcon className="h-5 w-5" />
                  Presentation
                </CardTitle>
                <CardDescription>Create a new presentation with shapes and templates</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <PresentationIcon className="h-16 w-16 text-[#8e44ad]/20" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2 bg-[#8e44ad] hover:bg-[#8e44ad]/90">
                  <Link to="/presentation" onClick={() => handleCreateNew("presentation")}>
                    <Plus className="h-4 w-4" />
                    Create Presentation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-8 text-[#8e44ad]">Recent Documents</h2>
          <div className="bg-muted/40 rounded-lg p-8 text-center border border-[#8e44ad]/10">
            <p className="text-muted-foreground">No recent documents found. Create a new document to get started.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
