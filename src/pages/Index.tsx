
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to document editor
    navigate("/document");
  }, [navigate]);
  
  return <SplashScreen />;
};

export default Index;
