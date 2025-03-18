
interface PrintStylesProps {
  orientation: "portrait" | "landscape";
}

export function PrintStyles({ orientation }: PrintStylesProps) {
  return (
    <style>
      {`
        @media print {
          @page {
            size: ${orientation === "landscape" ? "landscape" : "portrait"};
          }
        }
      `}
    </style>
  );
}
