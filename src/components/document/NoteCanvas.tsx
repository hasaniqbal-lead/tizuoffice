
import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface NoteCanvasProps {
  content: string;
  onChange: (content: string) => void;
  fontFamily: string;
  fontSize: string;
  activeStyle?: string;
}

export function NoteCanvas({ 
  content, 
  onChange, 
  fontFamily, 
  fontSize,
  activeStyle
}: NoteCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [textAlignment, setTextAlignment] = useState("left");
  
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
      const selectedText = content.substring(start, end) || 'New text';
      let newText = '';
      
      // Handle alignment styles
      if (activeStyle.startsWith('align-')) {
        const alignment = activeStyle.replace('align-', '');
        setTextAlignment(alignment);
        return;
      }
      
      switch (activeStyle) {
        case 'bold':
          newText = `**${selectedText}**`;
          break;
        case 'italic':
          newText = `*${selectedText}*`;
          break;
        case 'underline':
          newText = `_${selectedText}_`;
          break;
        case 'heading1':
          newText = `\n# ${selectedText}\n`;
          break;
        case 'heading2':
          newText = `\n## ${selectedText}\n`;
          break;
        case 'bullet':
          newText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
          break;
        case 'numbered':
          newText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
          break;
        default:
          newText = selectedText;
      }
      
      const newContent = 
        content.substring(0, start) + 
        newText + 
        content.substring(end);
      
      onChange(newContent);
      
      // Set selection after formatting
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + newText.length);
      }, 0);
    }
  }, [activeStyle, content, onChange]);

  // Apply text alignment to the text area
  const getTextAlignment = () => {
    switch (textAlignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto bg-white rounded-md shadow-sm border p-4 min-h-[calc(100vh-220px)] a4-page">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className={`border-none resize-none w-full h-full min-h-[calc(100vh-240px)] focus-visible:ring-0 p-0 ${fontSize} ${getTextAlignment()}`}
            style={{ fontFamily }}
            placeholder="Start typing your note here..."
          />
        </div>
      </div>
      <div className="p-2 flex justify-end">
        <span className="text-xs text-muted-foreground">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>
    </div>
  );
}
