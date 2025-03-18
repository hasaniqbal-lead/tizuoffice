
import { useCallback } from 'react';

export function useListHandling(content: string, onChange: (content: string) => void) {
  const handleList = useCallback((type: 'bullet' | 'numbered', start: number, end: number) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer as HTMLElement;
    
    if (parentElement) {
      const list = document.createElement(type === 'bullet' ? 'ul' : 'ol');
      const listItem = document.createElement('li');
      
      if (selection.toString().trim() === '') {
        // If no text is selected, create a new list item
        listItem.innerHTML = '&nbsp;'; // Add a space to make the item visible
        list.appendChild(listItem);
        range.insertNode(list);
      } else {
        // If text is selected, wrap it in a list item
        listItem.textContent = selection.toString();
        list.appendChild(listItem);
        range.deleteContents();
        range.insertNode(list);
      }
      
      // Update the content
      const target = parentElement.closest('[contenteditable="true"]');
      if (target) {
        onChange(target.innerHTML);
      }
    }
  }, [onChange]);

  return { handleList };
}
