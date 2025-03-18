
import { useCallback } from 'react';

export function useListHandling(content: string, onChange: (content: string) => void) {
  const handleList = useCallback((type: 'bullet' | 'numbered', start: number, end: number) => {
    if (start === end) {
      // If no text is selected, insert a point at cursor
      const prefix = type === 'bullet' ? '• ' : '1. ';
      const newContent = content.substring(0, start) + 
                        prefix + 
                        content.substring(end);
      onChange(newContent);
      return start + prefix.length;
    } else {
      // If text is selected, format each line
      const selectedText = content.substring(start, end);
      const lines = selectedText.split('\n');
      const formattedList = lines.map((line, i) => 
        type === 'bullet' ? `• ${line}` : `${i + 1}. ${line}`
      ).join('\n');
      
      const newContent = content.substring(0, start) + 
                        formattedList + 
                        content.substring(end);
      onChange(newContent);
      return start + formattedList.length;
    }
  }, [content, onChange]);

  return { handleList };
}
