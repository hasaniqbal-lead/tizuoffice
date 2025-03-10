
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Save, Settings, Plus, FileText, PresentationIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Spreadsheet templates
const templates = [
  { id: "blank", name: "Blank Spreadsheet", cells: Array(10).fill(null).map(() => Array(10).fill("")) },
  { id: "budget", name: "Budget Template", cells: (() => {
    const cells = Array(10).fill(null).map(() => Array(10).fill(""));
    cells[0][0] = "Month";
    cells[0][1] = "Income";
    cells[0][2] = "Expenses";
    cells[0][3] = "Savings";
    cells[1][0] = "January";
    cells[2][0] = "February";
    cells[3][0] = "March";
    return cells;
  })() },
  { id: "schedule", name: "Weekly Schedule", cells: (() => {
    const cells = Array(10).fill(null).map(() => Array(10).fill(""));
    cells[0][0] = "Time";
    cells[0][1] = "Monday";
    cells[0][2] = "Tuesday";
    cells[0][3] = "Wednesday";
    cells[0][4] = "Thursday";
    cells[0][5] = "Friday";
    return cells;
  })() }
];

const SpreadsheetEditor = () => {
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("Untitled Spreadsheet");
  const [activeTemplate, setActiveTemplate] = useState("blank");
  const [cells, setCells] = useState(
    Array(10).fill(null).map(() => Array(10).fill(""))
  );
  const [formula, setFormula] = useState("");
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = [...cells];
    newCells[rowIndex][colIndex] = value;
    setCells(newCells);
    
    // Set as selected cell
    setSelectedCell({row: rowIndex, col: colIndex});
    
    // If value starts with =, it might be a formula
    if (value.startsWith("=")) {
      setFormula(value);
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({row: rowIndex, col: colIndex});
    setFormula(cells[rowIndex][colIndex]);
  };

  const evaluateFormula = (formula: string, cells: string[][]) => {
    try {
      // Handle simple SUM formula: =SUM(A1:A3)
      if (formula.startsWith("=SUM(") && formula.endsWith(")")) {
        const range = formula.substring(5, formula.length - 1);
        const [start, end] = range.split(":");
        
        // Convert A1 notation to row/col indices
        const startCol = start.charCodeAt(0) - 65; // A=0, B=1, etc.
        const startRow = parseInt(start.substring(1)) - 1;
        const endCol = end.charCodeAt(0) - 65;
        const endRow = parseInt(end.substring(1)) - 1;
        
        let sum = 0;
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cellValue = parseFloat(cells[row][col]);
            if (!isNaN(cellValue)) {
              sum += cellValue;
            }
          }
        }
        return sum.toString();
      }
      
      // Handle AVERAGE formula: =AVERAGE(A1:A3)
      if (formula.startsWith("=AVERAGE(") && formula.endsWith(")")) {
        const range = formula.substring(9, formula.length - 1);
        const [start, end] = range.split(":");
        
        // Convert A1 notation to row/col indices
        const startCol = start.charCodeAt(0) - 65;
        const startRow = parseInt(start.substring(1)) - 1;
        const endCol = end.charCodeAt(0) - 65;
        const endRow = parseInt(end.substring(1)) - 1;
        
        let sum = 0;
        let count = 0;
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cellValue = parseFloat(cells[row][col]);
            if (!isNaN(cellValue)) {
              sum += cellValue;
              count++;
            }
          }
        }
        return count > 0 ? (sum / count).toString() : "0";
      }
      
      // Handle simple math expressions: =A1+B1
      if (formula.startsWith("=")) {
        // Replace cell references with values
        let expression = formula.substring(1);
        const cellRegex = /[A-Z]\d+/g;
        const cellRefs = expression.match(cellRegex) || [];
        
        for (const cellRef of cellRefs) {
          const col = cellRef.charCodeAt(0) - 65;
          const row = parseInt(cellRef.substring(1)) - 1;
          const cellValue = cells[row][col];
          expression = expression.replace(cellRef, cellValue || "0");
        }
        
        // Safely evaluate the expression
        // eslint-disable-next-line no-eval
        return eval(expression).toString();
      }
      
      return formula;
    } catch (error) {
      console.error("Formula evaluation error:", error);
      return "ERROR";
    }
  };

  const applyFormula = () => {
    if (!selectedCell) return;
    
    const newCells = [...cells];
    newCells[selectedCell.row][selectedCell.col] = formula;
    setCells(newCells);
    
    toast({
      title: "Formula applied",
      description: "Formula has been applied to the selected cell",
    });
  };

  const handleSave = () => {
    toast({
      title: "Spreadsheet saved",
      description: "Your spreadsheet has been saved successfully",
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCells([...template.cells]);
      setActiveTemplate(templateId);
      toast({
        title: "Template applied",
        description: `Applied ${template.name} template`,
      });
    }
  };

  const downloadSpreadsheet = (format: string) => {
    let filename = `${spreadsheetTitle}`;
    let content = "";
    let mimeType = "";
    let fileExtension = "";
    
    switch (format) {
      case "csv":
        content = cells.map(row => row.join(",")).join("\n");
        mimeType = "text/csv";
        fileExtension = ".csv";
        break;
      case "xls":
        content = cells.map(row => row.join("\t")).join("\n");
        mimeType = "application/vnd.ms-excel";
        fileExtension = ".xls";
        break;
      case "json":
        content = JSON.stringify(cells);
        mimeType = "application/json";
        fileExtension = ".json";
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
      title: "Spreadsheet downloaded",
      description: `Your spreadsheet has been downloaded as a ${format.toUpperCase()} file`,
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadSpreadsheet("csv")}>CSV (.csv)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadSpreadsheet("xls")}>Excel (.xls)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadSpreadsheet("json")}>JSON (.json)</DropdownMenuItem>
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
                  <SheetTitle>Spreadsheet Settings</SheetTitle>
                  <SheetDescription>
                    Configure your spreadsheet settings here.
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

      {/* Formula Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm font-medium">Formula:</span>
            <Input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="h-8"
              placeholder="Enter formula (e.g., =SUM(A1:A3))"
            />
            <Button size="sm" variant="secondary" onClick={applyFormula}>
              Apply
            </Button>
          </div>
          
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
                <Link to="/presentation">
                  <PresentationIcon className="h-4 w-4 mr-2" />
                  Presentation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
                  {row.map((cell, colIndex) => {
                    const isFormulaCell = cell.toString().startsWith("=");
                    const displayValue = isFormulaCell ? evaluateFormula(cell, cells) : cell;
                    
                    return (
                      <TableCell 
                        key={colIndex} 
                        className="p-0"
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        <Input
                          value={cell}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className={`border-none h-12 focus-visible:ring-0 ${
                            selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                              ? "bg-primary/5"
                              : ""
                          }`}
                          data-formula={isFormulaCell ? displayValue : undefined}
                        />
                      </TableCell>
                    );
                  })}
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
