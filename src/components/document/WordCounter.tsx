
interface WordCounterProps {
  count: number;
}

export function WordCounter({ count }: WordCounterProps) {
  return (
    <div className="p-2 flex justify-end">
      <span className="text-xs text-muted-foreground">
        {count} {count === 1 ? 'word' : 'words'}
      </span>
    </div>
  );
}
