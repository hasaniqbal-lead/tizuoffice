
import React, { useRef, useEffect, useState } from "react";
import { PrintStyles } from "./PrintStyles";
import { WordCounter } from "./WordCounter";
import { EditableContent } from "./EditableContent";
import { useTextStyling } from "@/hooks/useTextStyling";
import { useListHandling } from "@/hooks/useListHandling";

interface NoteCanvasProps {
  content: string;
  onChange: (content: string) => void;
  fontFamily: string;
  fontSize: string;
  activeStyle?: string;
  orientation?: "portrait" | "landscape";
}

export function NoteCanvas({ 
  content, 
  onChange, 
  fontFamily, 
  fontSize,
  activeStyle,
  orientation = "portrait"
}: NoteCanvasProps) {
  const [wordCount, setWordCount] = useState(0);
  const { getTextAlignment, getFontStyles } = useTextStyling(activeStyle);
  const { handleList } = useListHandling(content, onChange);
  
  useEffect(() => {
    // Calculate word count
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    const contentDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (contentDiv && activeStyle) {
      // Handle headings and lists
      switch (activeStyle) {
        case 'heading1': {
          document.execCommand('formatBlock', false, 'h1');
          break;
        }
        case 'heading2': {
          document.execCommand('formatBlock', false, 'h2');
          break;
        }
        case 'bullet':
        case 'numbered': {
          handleList(activeStyle, 0, 0);
          break;
        }
      }
    }
  }, [activeStyle, handleList]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className={`mx-auto bg-white rounded-md shadow-sm border ${orientation === "landscape" ? "landscape-page" : "a4-page"}`}>
          <PrintStyles orientation={orientation} />
          <EditableContent
            content={content}
            onChange={onChange}
            fontSize={fontSize}
            fontFamily={fontFamily}
            textAlignment={getTextAlignment()}
            fontStyles={getFontStyles()}
          />
        </div>
      </div>
      <WordCounter count={wordCount} />
    </div>
  );
}
