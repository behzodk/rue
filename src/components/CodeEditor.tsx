import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  className?: string;
}

const languageKeywords: Record<string, string[]> = {
  javascript: ["function", "const", "let", "var", "return", "if", "else", "for", "while", "class", "export", "import", "from", "async", "await", "try", "catch", "throw", "new", "this"],
  typescript: ["function", "const", "let", "var", "return", "if", "else", "for", "while", "class", "export", "import", "from", "async", "await", "try", "catch", "throw", "new", "this", "interface", "type", "extends", "implements"],
  python: ["def", "class", "return", "if", "else", "elif", "for", "while", "import", "from", "try", "except", "raise", "with", "as", "pass", "break", "continue", "lambda", "yield"],
  java: ["public", "private", "protected", "class", "interface", "extends", "implements", "return", "if", "else", "for", "while", "try", "catch", "throw", "new", "static", "void", "int", "String", "boolean"],
  cpp: ["int", "void", "return", "if", "else", "for", "while", "class", "public", "private", "protected", "include", "using", "namespace", "template", "typename", "const", "static", "new", "delete"],
  go: ["func", "return", "if", "else", "for", "range", "package", "import", "type", "struct", "interface", "var", "const", "defer", "go", "chan", "select", "case", "switch"],
  rust: ["fn", "let", "mut", "return", "if", "else", "for", "while", "loop", "struct", "impl", "trait", "pub", "use", "mod", "match", "enum", "type", "where", "async", "await"],
};

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setLineCount(newValue.split("\n").length);
  }, [onChange]);

  const lines = Math.max(lineCount, 20);

  return (
    <div className={cn("relative flex bg-card rounded-lg border border-border overflow-hidden", className)}>
      {/* Line numbers */}
      <div className="flex-shrink-0 select-none bg-muted/50 py-4 px-2 text-right border-r border-border">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="text-xs text-muted-foreground font-mono leading-6 h-6"
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative flex-1 overflow-auto">
        <textarea
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className={cn(
            "absolute inset-0 w-full h-full py-4 px-4 font-mono text-sm leading-6",
            "bg-transparent text-foreground resize-none",
            "focus:outline-none",
            "placeholder:text-muted-foreground/50"
          )}
          placeholder={`// Start coding in ${language}...`}
          style={{ minHeight: `${lines * 24 + 32}px` }}
        />
      </div>
    </div>
  );
}
