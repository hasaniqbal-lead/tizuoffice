
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 10, 100);
        return newProgress;
      });
    }, 300);

    // Navigate to document editor when loading is complete
    const navigationTimer = setTimeout(() => {
      navigate("/document");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md px-4">
        <h1 className="text-5xl font-bold text-primary animate-fade-in">
          tizu notes
        </h1>
        <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
          write up your next big thing
        </p>
        <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <Progress value={progress} className="h-2 w-64" />
        </div>
        <div className="animate-pulse flex justify-center" style={{ animationDelay: "900ms" }}>
          <Loader className="h-8 w-8 text-primary" />
        </div>
      </div>
    </div>
  );
}
