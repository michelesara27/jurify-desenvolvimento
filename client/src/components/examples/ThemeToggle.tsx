// src/components/examples/ThemeToggle.tsx
import { ThemeToggle } from "../ThemeToggle";

export default function ThemeToggleExample() {
  return (
    <div className="p-4 flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Alternar tema:</span>
      <ThemeToggle />
    </div>
  );
}
