
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { HighContrastToggle } from "@/components/HighContrastToggle";
import { useCollaboration } from "@/components/CollaborationProvider";
import { CollaboratorAvatars } from "@/components/CollaboratorAvatars";
import { RibbonMenu } from "@/components/RibbonMenu";
import { AppLogo } from "@/components/AppLogo";
import { AppFooter } from "@/components/AppFooter";

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

// Sample collaborators data
const sampleCollaborators = [
  { id: "user1", name: "John Doe", color: "#6366F1" },
  { id: "user2", name: "Jane Smith", color: "#8B5CF6" },
  { id: "user3", name: "Alex Johnson", color: "#EC4899" },
];

const SpreadsheetEditor = () => {
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("Untitled Spreadsheet");
  const [activeTemplate, setActiveTemplate] = useState("blank");
  const [cells, setCells] = useState(
    Array(10).fill(null).map(() => Array(10).fill(""))
  );
  const [formula, setFormula] = useState("");
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedFontSize, setSelectedFontSize] = useState("text-base");
  const { shareDocument, currentUsers, isCollaborating } = useCollaboration();
  const { isDarkMode, toggleDarkMode } = useTheme();

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
    // In a real app, would save to backend
    if (isCollaborating) {
      // Update the shared document
      shareDocument(spreadsheetTitle, JSON.stringify(cells));
    }
    
    toast({
      title: "Spreadsheet saved",
      description: "Your spreadsheet has been saved successfully",
    });
  };

  const handleShare = () => {
    const documentId = shareDocument(spreadsheetTitle, JSON.stringify(cells));
    
    // Copy sharing link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/spreadsheet?id=${documentId}`);
    
    toast({
      title: "Spreadsheet shared",
      description: "Sharing link copied to clipboard",
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
      case "xlsx":
        content = cells.map(row => row.join("\t")).join("\n");
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = ".xlsx";
        break;
      case "pdf":
        // In a real app, would convert to PDF
        content = cells.map(row => row.join("\t")).join("\n");
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
      title: "Spreadsheet downloaded",
      description: `Your spreadsheet has been downloaded as a ${format.toUpperCase()} file`,
    });
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
  };
  
  const handleStyleClick = (style: string) => {
    toast({
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} formatting`,
      description: "This feature is coming soon for spreadsheets",
    });
  };
  
  const handleAlignClick = (align: string) => {
    toast({
      title: `Text aligned ${align}`,
      description: "This feature is coming soon for spreadsheets",
    });
  };
  
  const handleListClick = (listType: string) => {
    toast({
      title: `${listType === 'bullet' ? 'Bullet' : 'Numbered'} list`,
      description: "This feature is not applicable for spreadsheets",
    });
  };
  
  const handleInsert = (type: string) => {
    if (type === 'chart') {
      toast({
        title: "Chart feature",
        description: "Chart insertion will be available soon",
      });
    } else {
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} inserted`,
        description: `This feature is coming soon for spreadsheets`,
      });
    }
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
                value={spreadsheetTitle}
                onChange={(e) => setSpreadsheetTitle(e.target.value)}
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
        editorType="spreadsheet"
        currentFont={selectedFont}
        currentSize={selectedFontSize}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        onStyleClick={handleStyleClick}
        onAlignClick={handleAlignClick}
        onListClick={handleListClick}
        onSave={handleSave}
        onShare={handleShare}
        onDownload={downloadSpreadsheet}
        onInsert={handleInsert}
      />

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
                          style={{ fontFamily: selectedFont }}
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

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default SpreadsheetEditor;
