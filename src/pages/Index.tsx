
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
        <div className="container py-4">
          <h1 className="text-3xl font-bold">Tizu Office</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Create New</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Document Card */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Document
                </CardTitle>
                <CardDescription>Create a new text document</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2">
                  <Link to="/document" onClick={() => handleCreateNew("document")}>
                    <Plus className="h-4 w-4" />
                    Create Document
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Spreadsheet Card */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Spreadsheet
                </CardTitle>
                <CardDescription>Create a new spreadsheet</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2">
                  <Link to="/spreadsheet" onClick={() => handleCreateNew("spreadsheet")}>
                    <Plus className="h-4 w-4" />
                    Create Spreadsheet
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Presentation Card */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <PresentationIcon className="h-5 w-5 text-primary" />
                  Presentation
                </CardTitle>
                <CardDescription>Create a new presentation</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                  <PresentationIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full gap-2">
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
          <h2 className="text-2xl font-semibold mb-6">Recent Documents</h2>
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No recent documents found. Create a new document to get started.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
