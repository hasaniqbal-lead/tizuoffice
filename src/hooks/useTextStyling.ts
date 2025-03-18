
import { useState, useEffect } from 'react';

export function useTextStyling(activeStyle?: string) {
  const [textAlignment, setTextAlignment] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);

  useEffect(() => {
    if (activeStyle) {
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
      }
    }
  }, [activeStyle, isBold, isItalic, isUnderlined]);

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

  const getFontStyles = () => {
    const styles = [];
    if (isBold) styles.push('font-bold');
    if (isItalic) styles.push('italic');
    if (isUnderlined) styles.push('underline');
    return styles.join(' ');
  };

  return {
    getTextAlignment,
    getFontStyles
  };
}
