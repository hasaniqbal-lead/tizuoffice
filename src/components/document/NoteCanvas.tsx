
import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

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
  const [textAlignment, setTextAlignment] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  
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
      
      // Handle alignment styles
      if (activeStyle.startsWith('align-')) {
        const alignment = activeStyle.replace('align-', '');
        setTextAlignment(alignment);
        return;
      }
      
      // Handle text formatting
      switch (activeStyle) {
        case 'bold':
          document.execCommand('bold', false);
          setIsBold(!isBold);
          break;
        case 'italic':
          document.execCommand('italic', false);
          setIsItalic(!isItalic);
          break;
        case 'underline':
          document.execCommand('underline', false);
          setIsUnderlined(!isUnderlined);
          break;
        case 'heading1':
          // Insert heading formatting
          const heading1Text = content.substring(start, end) || 'Heading 1';
          const h1Content = content.substring(0, start) + 
                           `\n\n${heading1Text}\n\n` + 
                           content.substring(end);
          onChange(h1Content);
          
          // Set cursor position after the heading
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + heading1Text.length + 4;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
          break;
        case 'heading2':
          // Insert heading formatting
          const heading2Text = content.substring(start, end) || 'Heading 2';
          const h2Content = content.substring(0, start) + 
                           `\n\n${heading2Text}\n\n` + 
                           content.substring(end);
          onChange(h2Content);
          
          // Set cursor position after the heading
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + heading2Text.length + 4;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
          break;
        case 'bullet':
          // Insert bullet list
          if (start === end) {
            // If no text is selected, insert a bullet point at cursor
            const bulletContent = content.substring(0, start) + 
                                 "• " + 
                                 content.substring(end);
            onChange(bulletContent);
            
            // Set cursor position after the bullet
            setTimeout(() => {
              textarea.focus();
              const newPosition = start + 2;
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          } else {
            // If text is selected, format each line with a bullet
            const selectedText = content.substring(start, end);
            const lines = selectedText.split('\n');
            const bulletList = lines.map(line => `• ${line}`).join('\n');
            
            const newContent = content.substring(0, start) + 
                              bulletList + 
                              content.substring(end);
            onChange(newContent);
            
            // Set selection after formatting
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start, start + bulletList.length);
            }, 0);
          }
          break;
        case 'numbered':
          // Insert numbered list
          if (start === end) {
            // If no text is selected, insert a numbered point at cursor
            const numberedContent = content.substring(0, start) + 
                                  "1. " + 
                                  content.substring(end);
            onChange(numberedContent);
            
            // Set cursor position after the number
            setTimeout(() => {
              textarea.focus();
              const newPosition = start + 3;
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          } else {
            // If text is selected, format each line with a number
            const selectedText = content.substring(start, end);
            const lines = selectedText.split('\n');
            const numberedList = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
            
            const newContent = content.substring(0, start) + 
                              numberedList + 
                              content.substring(end);
            onChange(newContent);
            
            // Set selection after formatting
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start, start + numberedList.length);
            }, 0);
          }
          break;
        default:
          break;
      }
    }
  }, [activeStyle, content, onChange, isBold, isItalic, isUnderlined]);

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

  // Get font styling classes
  const getFontStyles = () => {
    const styles = [];
    if (isBold) styles.push('font-bold');
    if (isItalic) styles.push('italic');
    if (isUnderlined) styles.push('underline');
    return styles.join(' ');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className={`mx-auto bg-white rounded-md shadow-sm border p-4 min-h-[calc(100vh-220px)] ${orientation === "landscape" ? "landscape-page" : "a4-page"}`}>
          <style jsx>{`
            @media print {
              @page {
                size: ${orientation === "landscape" ? "landscape" : "portrait"};
              }
            }
          `}</style>
          <div 
            contentEditable="true"
            className={`w-full h-full min-h-[calc(100vh-240px)] outline-none p-0 ${fontSize} ${getTextAlignment()} ${getFontStyles()}`}
            style={{ fontFamily }}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              onChange(target.innerText);
            }}
            dangerouslySetInnerHTML={{ __html: content }}
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
