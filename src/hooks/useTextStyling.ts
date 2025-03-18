
import { useState, useEffect } from 'react';

export function useTextStyling(activeStyle?: string) {
  const [textAlignment, setTextAlignment] = useState("text-left");
  const [fontStyles, setFontStyles] = useState<string[]>([]);

  useEffect(() => {
    if (activeStyle) {
      // Handle alignment styles
      if (activeStyle.startsWith('align-')) {
        const alignment = activeStyle.replace('align-', '');
        setTextAlignment(`text-${alignment}`);
        return;
      }

      // Handle text formatting
      switch (activeStyle) {
        case 'bold':
          setFontStyles(prev => 
            prev.includes('font-bold') 
              ? prev.filter(style => style !== 'font-bold')
              : [...prev, 'font-bold']
          );
          break;
        case 'italic':
          setFontStyles(prev => 
            prev.includes('italic') 
              ? prev.filter(style => style !== 'italic')
              : [...prev, 'italic']
          );
          break;
        case 'underline':
          setFontStyles(prev => 
            prev.includes('underline') 
              ? prev.filter(style => style !== 'underline')
              : [...prev, 'underline']
          );
          break;
      }
    }
  }, [activeStyle]);

  return {
    getTextAlignment: () => textAlignment,
    getFontStyles: () => fontStyles.join(' ')
  };
}
