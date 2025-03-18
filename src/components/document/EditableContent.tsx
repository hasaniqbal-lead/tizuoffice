
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
      className={`w-full h-full min-h-[calc(100vh-240px)] outline-none p-0 ${fontSize} ${textAlignment} ${fontStyles}`}
      style={{ fontFamily }}
      onInput={(e) => {
        const target = e.target as HTMLDivElement;
        onChange(target.innerText);
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
