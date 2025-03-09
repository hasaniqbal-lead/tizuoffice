
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Save, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const SpreadsheetEditor = () => {
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("Untitled Spreadsheet");
  
  // Initialize a 10x10 spreadsheet with empty values
  const [cells, setCells] = useState(
    Array(10).fill(null).map(() => Array(10).fill(""))
  );

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = [...cells];
    newCells[rowIndex][colIndex] = value;
    setCells(newCells);
  };

  const handleSave = () => {
    toast({
      title: "Spreadsheet saved",
      description: "Your spreadsheet has been saved successfully",
    });
  };

  const downloadSpreadsheet = () => {
    // Create CSV content
    const csvContent = cells.map(row => row.join(",")).join("\n");
    
    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = `${spreadsheetTitle}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Spreadsheet downloaded",
      description: "Your spreadsheet has been downloaded as a CSV file",
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
                value={spreadsheetTitle}
                onChange={(e) => setSpreadsheetTitle(e.target.value)}
                className="text-lg font-medium border-none focus-visible:ring-0 px-0 h-auto py-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSpreadsheet}>
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
                  <SheetTitle>Spreadsheet Settings</SheetTitle>
                  <SheetDescription>
                    Configure your spreadsheet settings here.
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

      {/* Spreadsheet */}
      <main className="flex-1 container py-6 overflow-auto">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {Array(10).fill(null).map((_, colIndex) => (
                  <TableHead key={colIndex}>
                    {String.fromCharCode(65 + colIndex)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cells.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex} className="p-0">
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="border-none h-12 focus-visible:ring-0"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default SpreadsheetEditor;
