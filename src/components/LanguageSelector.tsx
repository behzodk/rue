import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type Language = {
  id: string;
  name: string;
  extension: string;
};

const languages: Language[] = [
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "typescript", name: "TypeScript", extension: "ts" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "go", name: "Go", extension: "go" },
  { id: "rust", name: "Rust", extension: "rs" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (languageId: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = languages.find((l) => l.id === value) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
          "bg-secondary border border-border hover:bg-accent transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50"
        )}
      >
        <span>{selectedLanguage.name}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 min-w-[160px] py-1 rounded-md border border-border bg-popover shadow-lg animate-fade-in">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => {
                  onChange(language.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                  value === language.id && "text-primary bg-accent"
                )}
              >
                {language.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { languages };
