
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
      suppressContentEditableWarning={true}
      className={`w-full h-full min-h-[calc(100vh-240px)] outline-none p-4 whitespace-pre-wrap ${fontSize} ${fontStyles}`}
      style={{ 
        fontFamily: 'Calibri, sans-serif', // Fixed to Calibri
        writingMode: 'horizontal-tb',
        direction: 'ltr',
        unicodeBidi: 'bidi-override', // This ensures strong directional override
        textAlign: textAlignment === 'text-left' ? 'left' 
          : textAlignment === 'text-center' ? 'center'
          : textAlignment === 'text-right' ? 'right'
          : textAlignment === 'text-justify' ? 'justify'
          : 'left'
      }}
      onInput={(e) => {
        const target = e.target as HTMLDivElement;
        onChange(target.innerHTML);
      }}
      dangerouslySetInnerHTML={{ __html: content || '' }}
    />
  );
}
