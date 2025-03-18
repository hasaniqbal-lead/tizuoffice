
import { ThemeToggle } from "@/components/ThemeToggle";
import { HighContrastToggle } from "@/components/HighContrastToggle";

export function AppHeader() {
  return (
    <div className="fixed top-0 right-0 p-2 flex items-center gap-2 z-50">
      <HighContrastToggle />
      <ThemeToggle />
    </div>
  );
}
