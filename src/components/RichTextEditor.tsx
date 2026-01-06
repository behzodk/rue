import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RichTextMode = "rich" | "html";

interface RichTextEditorProps {
  value: string;
  mode: RichTextMode;
  onChange: (value: string) => void;
  onModeChange: (mode: RichTextMode) => void;
}

export function RichTextEditor({ value, mode, onChange, onModeChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const linkAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const [linkDialog, setLinkDialog] = useState({
    isOpen: false,
    text: "",
    url: "",
    isEditing: false,
  });

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current === document.activeElement) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const applyCommand = (command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const getAnchorFromSelection = () => {
    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode;
    if (!anchorNode) return null;
    const element = anchorNode.nodeType === Node.ELEMENT_NODE ? (anchorNode as Element) : anchorNode.parentElement;
    return element?.closest("a") as HTMLAnchorElement | null;
  };

  const openLinkDialog = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    const anchor = getAnchorFromSelection();
    linkAnchorRef.current = anchor;
    selectionRef.current = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    setLinkDialog({
      isOpen: true,
      text: anchor?.textContent?.trim() || selectedText,
      url: anchor?.getAttribute("href") ?? "",
      isEditing: Boolean(anchor),
    });
  };

  const closeLinkDialog = () => {
    setLinkDialog({
      isOpen: false,
      text: "",
      url: "",
      isEditing: false,
    });
    selectionRef.current = null;
    linkAnchorRef.current = null;
  };

  const insertLink = () => {
    if (!editorRef.current) {
      closeLinkDialog();
      return;
    }
    editorRef.current.focus();
    const selection = window.getSelection();
    if (selection && selectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
    const url = linkDialog.url.trim();
    const text = linkDialog.text.trim() || url;
    if (!url || !text) {
      closeLinkDialog();
      return;
    }
    if (linkAnchorRef.current) {
      linkAnchorRef.current.outerHTML = `<a href="${url}" target="_blank" rel="noreferrer">${text}</a>`;
    } else {
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url}" target="_blank" rel="noreferrer">${text}</a>`,
      );
    }
    onChange(editorRef.current.innerHTML);
    closeLinkDialog();
  };

  const removeLink = () => {
    if (!editorRef.current) {
      closeLinkDialog();
      return;
    }
    editorRef.current.focus();
    if (linkAnchorRef.current) {
      linkAnchorRef.current.replaceWith(linkAnchorRef.current.textContent ?? "");
    } else {
      document.execCommand("unlink");
    }
    onChange(editorRef.current.innerHTML);
    closeLinkDialog();
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-full border border-border bg-secondary p-1 text-xs">
        {["rich", "html"].map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => onModeChange(variant as RichTextMode)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              mode === variant ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {variant === "rich" ? "Rich text" : "HTML"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "H1", command: "formatBlock", value: "h1" },
          { label: "Bold", command: "bold" },
          { label: "Italic", command: "italic" },
          { label: "Underline", command: "underline" },
          { label: "List", command: "insertUnorderedList" },
          { label: "Code", command: "formatBlock", value: "pre" },
        ].map((button) => (
          <Button
            key={button.label}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => applyCommand(button.command, button.value)}
          >
            {button.label}
          </Button>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={openLinkDialog}>
          Link
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background/70 p-4">
        {mode === "rich" ? (
          <div
            ref={editorRef}
            onInput={(event) => {
              onChange((event.currentTarget as HTMLDivElement).innerHTML);
            }}
            contentEditable
            suppressContentEditableWarning
            className={cn(
              "min-h-[220px] outline-none prose prose-sm max-w-none text-foreground",
              "[&_a]:text-sky-600 [&_a]:underline dark:[&_a]:text-sky-400",
              "[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2",
              "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2",
              "[&_p]:text-sm [&_p]:leading-relaxed",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:my-3",
              "[&_li]:mb-1",
            )}
          />
        ) : (
          <Textarea
            className="min-h-[220px] font-mono text-xs"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>

      {linkDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm px-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Insert link</h3>
            <p className="text-sm text-muted-foreground">Set the link text and destination in one step.</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Text</label>
                <Input
                  value={linkDialog.text}
                  onChange={(event) =>
                    setLinkDialog((prev) => ({ ...prev, text: event.target.value }))
                  }
                  placeholder="Visible text"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">URL</label>
                <Input
                  value={linkDialog.url}
                  onChange={(event) =>
                    setLinkDialog((prev) => ({ ...prev, url: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {linkDialog.isEditing && (
                <Button variant="ghost" onClick={removeLink}>
                  Remove link
                </Button>
              )}
              <Button variant="ghost" onClick={closeLinkDialog}>
                Cancel
              </Button>
              <Button onClick={insertLink}>Insert link</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
