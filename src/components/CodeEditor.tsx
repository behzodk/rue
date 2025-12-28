import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  className?: string;
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  go: "go",
  rust: "rust",
};

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
  const { theme } = useTheme();

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  return (
    <div className={cn("relative rounded-lg border border-border overflow-hidden", className)}>
      <Editor
        height="100%"
        language={languageMap[language] || "javascript"}
        value={value}
        onChange={handleChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: true,
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
