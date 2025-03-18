
interface EditableContentProps {
  content: string;
  onChange: (content: string) => void;
  fontSize: string;
  fontFamily: string;
  textAlignment: string;
  fontStyles: string;
}

export function EditableContent({
  content,
  onChange,
  fontSize,
  fontFamily,
  textAlignment,
  fontStyles
}: EditableContentProps) {
  return (
    <div 
      contentEditable="true"
      className={`w-full h-full min-h-[calc(100vh-240px)] outline-none p-4 ${fontSize} ${textAlignment} ${fontStyles}`}
      style={{ 
        fontFamily: `"${fontFamily}", sans-serif`,
        direction: 'ltr'  // Explicitly set left-to-right text direction
      }}
      onInput={(e) => {
        const target = e.target as HTMLDivElement;
        onChange(target.innerHTML); // Using innerHTML instead of innerText to preserve formatting
      }}
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
