
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
        fontFamily: fontFamily || 'sans-serif', // Ensure we always have a fallback
        direction: 'ltr',
        textAlign: textAlignment === 'text-left' ? 'left' 
          : textAlignment === 'text-center' ? 'center'
          : textAlignment === 'text-right' ? 'right'
          : textAlignment === 'text-justify' ? 'justify'
          : 'left'
      }}
      onInput={(e) => {
        const target = e.target as HTMLDivElement;
        onChange(target.innerHTML || ''); // Ensure we never pass null/undefined
      }}
      dangerouslySetInnerHTML={{ __html: content || '' }} // Ensure we never render null/undefined
    />
  );
}
