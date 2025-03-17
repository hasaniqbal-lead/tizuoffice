
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLogo } from "@/components/AppLogo";

interface DocumentHeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
}

export function DocumentHeader({ documentTitle, onTitleChange }: DocumentHeaderProps) {
  return (
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
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-medium border-none focus-visible:ring-0 px-0 h-auto py-1"
            placeholder="Untitled Note"
          />
        </div>
      </div>
    </div>
  );
}
