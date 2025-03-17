import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, FileSpreadsheet, PresentationIcon, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { HighContrastToggle } from "@/components/HighContrastToggle";
const Index = () => {
  const {
    isDarkMode,
    toggleDarkMode
  } = useTheme();
  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">tizu docs.</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
              <Moon className="h-4 w-4" />
            </div>
            <HighContrastToggle />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/document" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>Notes.</CardTitle>
                <CardDescription>Create and edit text documents</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <FileText className="h-16 w-16 text-primary" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> New Document
                </Button>
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/spreadsheet" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>Spreadsheet</CardTitle>
                <CardDescription>Work with data and calculations</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <FileSpreadsheet className="h-16 w-16 text-primary" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> New Spreadsheet
                </Button>
              </CardFooter>
            </Card>
          </Link>
          
          <Link to="/presentation" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>Presentation</CardTitle>
                <CardDescription>Create slideshows and presentations</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <PresentationIcon className="h-16 w-16 text-primary" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> New Presentation
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>;
};
export default Index;