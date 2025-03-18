
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const { getTextAlignment, getFontStyles } = useTextStyling(activeStyle);
  const { handleList } = useListHandling(content, onChange);
  
  useEffect(() => {
    // Calculate word count
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    if (textareaRef.current && activeStyle) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Handle headings and lists
      switch (activeStyle) {
        case 'heading1': {
          const headingText = content.substring(start, end) || 'Heading 1';
          const newContent = content.substring(0, start) + 
                           `\n\n${headingText}\n\n` + 
                           content.substring(end);
          onChange(newContent);
          break;
        }
        case 'heading2': {
          const headingText = content.substring(start, end) || 'Heading 2';
          const newContent = content.substring(0, start) + 
                           `\n\n${headingText}\n\n` + 
                           content.substring(end);
          onChange(newContent);
          break;
        }
        case 'bullet':
        case 'numbered': {
          const newPosition = handleList(
            activeStyle as 'bullet' | 'numbered',
            start,
            end
          );
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
          break;
        }
      }
    }
  }, [activeStyle, content, onChange, handleList]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className={`mx-auto bg-white rounded-md shadow-sm border p-4 min-h-[calc(100vh-220px)] ${orientation === "landscape" ? "landscape-page" : "a4-page"}`}>
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
