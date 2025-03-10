
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import DocumentEditor from "./pages/DocumentEditor";
import SpreadsheetEditor from "./pages/SpreadsheetEditor";
import PresentationEditor from "./pages/PresentationEditor";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CollaborationProvider } from "@/components/CollaborationProvider";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <CollaborationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/document" element={<DocumentEditor />} />
            <Route path="/spreadsheet" element={<SpreadsheetEditor />} />
            <Route path="/presentation" element={<PresentationEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </CollaborationProvider>
    </ThemeProvider>
  );
}

export default App;
