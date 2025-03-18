
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplashScreen } from "@/components/SplashScreen";
import DocumentEditor from "./pages/DocumentEditor";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CollaborationProvider } from "@/components/CollaborationProvider";
import { AppHeader } from "@/components/AppHeader";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <CollaborationProvider>
        <TooltipProvider>
          <Router>
            <AppHeader />
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/document" element={<DocumentEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </TooltipProvider>
      </CollaborationProvider>
    </ThemeProvider>
  );
}

export default App;
