
import { useState, useEffect } from 'react';

export function useTextStyling(activeStyle?: string) {
  const [textAlignment, setTextAlignment] = useState("text-left");
  const [fontStyles, setFontStyles] = useState<string[]>([]);

  useEffect(() => {
    if (!activeStyle) return;

    // Handle alignment styles
    if (activeStyle.startsWith('align-')) {
      const alignment = activeStyle.replace('align-', '');
      setTextAlignment(`text-${alignment}`);
      return;
    }

    // Handle text formatting
    switch (activeStyle) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'heading1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'heading2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
    }
  }, [activeStyle]);

  return {
    getTextAlignment: () => textAlignment,
    getFontStyles: () => fontStyles.join(' ')
  };
}
