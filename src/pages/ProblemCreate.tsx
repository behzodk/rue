import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Lightbulb,
  Plus,
  Trash2,
  Video,
  Wand2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/RichTextEditor";

type ExampleBlock = {
  input: string;
  output: string;
  explanation: string;
};

type MediaBlock = {
  url: string;
  caption: string;
};

type SectionType = "statement" | "images" | "videos" | "examples" | "constraints" | "hints";

type Section =
  | { id: string; type: "statement"; data: { mode: "rich" | "html"; html: string } }
  | { id: string; type: "images"; data: MediaBlock[] }
  | { id: string; type: "videos"; data: MediaBlock[] }
  | { id: string; type: "examples"; data: ExampleBlock[] }
  | { id: string; type: "constraints"; data: string[] }
  | { id: string; type: "hints"; data: string[] };

const emptyExample: ExampleBlock = { input: "", output: "", explanation: "" };
const emptyMedia: MediaBlock = { url: "", caption: "" };

const createSection = (type: SectionType): Section => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  switch (type) {
    case "statement":
      return { id, type, data: { mode: "rich", html: "<p>Describe the challenge with precision.</p>" } };
    case "images":
      return { id, type, data: [{ ...emptyMedia }] };
    case "videos":
      return { id, type, data: [{ ...emptyMedia }] };
    case "examples":
      return { id, type, data: [{ ...emptyExample }] };
    case "constraints":
      return { id, type, data: [""] };
    case "hints":
      return { id, type, data: [""] };
    default:
      return { id, type: "statement", data: { mode: "rich", html: "" } };
  }
};

export default function ProblemCreate() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [sections, setSections] = useState<Section[]>([createSection("statement")]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<"summary" | "preview">("summary");

  const normalizeSections = (items: Section[]) => {
    const hintIndex = items.findIndex((section) => section.type === "hints");
    if (hintIndex === -1) return items;
    const hintSection = items[hintIndex];
    const withoutHint = items.filter((_, index) => index !== hintIndex);
    return [...withoutHint, hintSection];
  };

  const updateSection = <T extends Section["data"]>(
    id: string,
    updater: (current: T) => T,
  ) => {
    setHasUnsavedChanges(true);
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== id) return section;
        return { ...section, data: updater(section.data as T) } as Section;
      }),
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setHasUnsavedChanges(true);
    setSections((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeSections(next);
    });
  };

  const removeSection = (id: string) => {
    setHasUnsavedChanges(true);
    setSections((prev) => {
      const target = prev.find((section) => section.id === id);
      if (!target) return prev;
      if (target.type === "statement") {
        const statementCount = prev.filter((section) => section.type === "statement").length;
        if (statementCount <= 1) return prev;
      }
      return prev.filter((section) => section.id !== id);
    });
  };

  const addSection = (type: SectionType) => {
    setHasUnsavedChanges(true);
    setSections((prev) => {
      const hasHints = prev.some((section) => section.type === "hints");
      if (type === "hints") {
        if (hasHints) return prev;
        return [...prev, createSection("hints")];
      }
      const nextSection = createSection(type);
      if (!hasHints) return [...prev, nextSection];
      const hintIndex = prev.findIndex((section) => section.type === "hints");
      const next = [...prev];
      next.splice(hintIndex, 0, nextSection);
      return next;
    });
  };


  const previewTitle = useMemo(() => title.trim() || "Untitled Problem", [title]);
  const tagPalette = [
    "border-primary/30 bg-primary/10 text-primary",
    "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  ];

  const addTags = (raw: string[]) => {
    const next = raw
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    if (next.length === 0) return;
    setHasUnsavedChanges(true);
    setTags((prev) => {
      const merged = new Set(prev);
      next.forEach((tag) => merged.add(tag));
      return Array.from(merged);
    });
  };

  const handleTagsChange = (value: string) => {
    if (!value.includes(",")) {
      setTagsInput(value);
      return;
    }
    const pieces = value.split(",");
    const remainder = pieces.pop() ?? "";
    addTags(pieces);
    setTagsInput(remainder);
  };

  const finalizeTagsInput = () => {
    if (!tagsInput.trim()) return;
    addTags([tagsInput]);
    setTagsInput("");
  };


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (title !== "" || tags.length > 0) setHasUnsavedChanges(true);
  }, [title, tags.length]);

  const prepareStatementHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("a").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noreferrer");
    });
    return doc.body.innerHTML;
  };

  const statementPreviewHtml = useMemo(() => {
    const raw = sections
      .filter((section) => section.type === "statement")
      .map((section) => (section as Section & { data: { html: string } }).data.html)
      .join(" ");
    return prepareStatementHtml(raw);
  }, [sections]);

  const examplesCount = useMemo(
    () =>
      sections
        .filter((section) => section.type === "examples")
        .reduce((total, section) => total + section.data.length, 0),
    [sections],
  );

  const constraintsCount = useMemo(
    () =>
      sections
        .filter((section) => section.type === "constraints")
        .reduce((total, section) => total + section.data.filter(Boolean).length, 0),
    [sections],
  );

  const hintsCount = useMemo(
    () =>
      sections
        .filter((section) => section.type === "hints")
        .reduce((total, section) => total + section.data.filter(Boolean).length, 0),
    [sections],
  );

  const imageUrls = useMemo(
    () =>
      sections
        .filter((section) => section.type === "images")
        .flatMap((section) => section.data)
        .map((item) => item.url.trim())
        .filter(Boolean),
    [sections],
  );

  const videoUrls = useMemo(
    () =>
      sections
        .filter((section) => section.type === "videos")
        .flatMap((section) => section.data)
        .map((item) => item.url.trim())
        .filter(Boolean),
    [sections],
  );

  const hasHintsSection = useMemo(
    () => sections.some((section) => section.type === "hints"),
    [sections],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-10">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Create a problem</h1>
                  <p className="text-sm text-muted-foreground">
                    Build a precise, high-signal prompt with rich sections and focused constraints.
                  </p>
                </div>
                <span className="hidden md:flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Draft v0.1
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Problem title</label>
                  <Input
                    placeholder="Calibrate the array balance"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <div className="relative">
                    <select
                      value={difficulty}
                      onChange={(event) => {
                        setDifficulty(event.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {["Easy", "Medium", "Hard"].map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="rounded-md border border-input bg-background px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium",
                            tagPalette[index % tagPalette.length],
                          )}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        value={tagsInput}
                        onChange={(event) => handleTagsChange(event.target.value)}
                        onBlur={finalizeTagsInput}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            finalizeTagsInput();
                          }
                        }}
                        placeholder="Type tags (e.g. linked list), hit comma"
                        className="min-w-[160px] flex-1 bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Section flow</h2>
                  <p className="text-sm text-muted-foreground">
                    Order the story: statement, media, examples, constraints, hints. Repeat as needed.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { type: "statement" as const, label: "Statement" },
                    { type: "images" as const, label: "Image" },
                    { type: "videos" as const, label: "Video" },
                    { type: "examples" as const, label: "Example" },
                    { type: "constraints" as const, label: "Constraint" },
                    { type: "hints" as const, label: "Hint", disabled: hasHintsSection },
                  ].map((item) => (
                    <Button
                      key={item.type}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addSection(item.type)}
                      disabled={item.disabled}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {sections.map((section, index) => {
                const meta = {
                  statement: { label: "Problem statement", icon: FileText },
                  images: { label: "Images", icon: ImageIcon },
                  videos: { label: "Video", icon: Video },
                  examples: { label: "Examples", icon: ListChecks },
                  constraints: { label: "Constraints", icon: ListChecks },
                  hints: { label: "Hints", icon: Lightbulb },
                }[section.type];
                const Icon = meta.icon;
                const isHints = section.type === "hints";
                const isStatement = section.type === "statement";
                const statementCount = sections.filter((item) => item.type === "statement").length;
                const isOnlyStatement = isStatement && statementCount <= 1;

                return (
                  <div key={section.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{meta.label}</h3>
                        {isHints && (
                          <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                            Must be last
                          </span>
                        )}
                        {isOnlyStatement && (
                          <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                            Required section
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!isHints && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveSection(index, -1)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveSection(index, 1)}
                              disabled={index === sections.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(section.id)}
                          disabled={isOnlyStatement}
                          title={isOnlyStatement ? "At least one problem statement is required." : "Remove section"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {section.type === "statement" && (
                      <div className="mt-4">
                        <RichTextEditor
                          value={section.data.html}
                          mode={section.data.mode}
                          onModeChange={(nextMode) =>
                            updateSection(section.id, (current) => ({
                              ...(current as { mode: "rich" | "html"; html: string }),
                              mode: nextMode,
                            }))
                          }
                          onChange={(nextHtml) =>
                            updateSection(section.id, (current) => ({
                              ...(current as { mode: "rich" | "html"; html: string }),
                              html: nextHtml,
                            }))
                          }
                        />
                      </div>
                    )}

                    {section.type === "images" && (
                      <div className="mt-4 space-y-4">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            updateSection(section.id, (current) => [...(current as MediaBlock[]), { ...emptyMedia }])
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add image
                        </Button>
                        {section.data.map((image, imageIndex) => (
                          <div
                            key={`image-${section.id}-${imageIndex}`}
                            className="space-y-3 rounded-xl border border-border bg-background/60 p-4"
                          >
                            <Input
                              placeholder="Image URL"
                              value={image.url}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as MediaBlock[])];
                                  next[imageIndex] = { ...image, url: event.target.value };
                                  return next;
                                })
                              }
                            />
                            <Input
                              placeholder="Caption"
                              value={image.caption}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as MediaBlock[])];
                                  next[imageIndex] = { ...image, caption: event.target.value };
                                  return next;
                                })
                              }
                            />
                            {section.data.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  updateSection(section.id, (current) =>
                                    (current as MediaBlock[]).filter((_, idx) => idx !== imageIndex),
                                  )
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "videos" && (
                      <div className="mt-4 space-y-4">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            updateSection(section.id, (current) => [...(current as MediaBlock[]), { ...emptyMedia }])
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add video
                        </Button>
                        {section.data.map((video, videoIndex) => (
                          <div
                            key={`video-${section.id}-${videoIndex}`}
                            className="space-y-3 rounded-xl border border-border bg-background/60 p-4"
                          >
                            <Input
                              placeholder="Video URL (YouTube, Loom, etc.)"
                              value={video.url}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as MediaBlock[])];
                                  next[videoIndex] = { ...video, url: event.target.value };
                                  return next;
                                })
                              }
                            />
                            <Input
                              placeholder="Caption"
                              value={video.caption}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as MediaBlock[])];
                                  next[videoIndex] = { ...video, caption: event.target.value };
                                  return next;
                                })
                              }
                            />
                            {section.data.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  updateSection(section.id, (current) =>
                                    (current as MediaBlock[]).filter((_, idx) => idx !== videoIndex),
                                  )
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "examples" && (
                      <div className="mt-4 space-y-4">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            updateSection(section.id, (current) => [...(current as ExampleBlock[]), { ...emptyExample }])
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add example
                        </Button>
                        {section.data.map((example, exampleIndex) => (
                          <div
                            key={`example-${section.id}-${exampleIndex}`}
                            className="rounded-xl border border-border bg-background/60 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">Example {exampleIndex + 1}</p>
                              {section.data.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    updateSection(section.id, (current) =>
                                      (current as ExampleBlock[]).filter((_, idx) => idx !== exampleIndex),
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                              )}
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <Textarea
                                placeholder="Input"
                                className="min-h-[90px] font-mono text-xs"
                                value={example.input}
                                onChange={(event) =>
                                  updateSection(section.id, (current) => {
                                    const next = [...(current as ExampleBlock[])];
                                    next[exampleIndex] = { ...example, input: event.target.value };
                                    return next;
                                  })
                                }
                              />
                              <Textarea
                                placeholder="Output"
                                className="min-h-[90px] font-mono text-xs"
                                value={example.output}
                                onChange={(event) =>
                                  updateSection(section.id, (current) => {
                                    const next = [...(current as ExampleBlock[])];
                                    next[exampleIndex] = { ...example, output: event.target.value };
                                    return next;
                                  })
                                }
                              />
                            </div>
                            <Textarea
                              placeholder="Explanation"
                              className="mt-3 min-h-[90px]"
                              value={example.explanation}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as ExampleBlock[])];
                                  next[exampleIndex] = { ...example, explanation: event.target.value };
                                  return next;
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "constraints" && (
                      <div className="mt-4 space-y-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => updateSection(section.id, (current) => [...(current as string[]), ""])}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add constraint
                        </Button>
                        {section.data.map((constraint, constraintIndex) => (
                          <div key={`constraint-${section.id}-${constraintIndex}`} className="flex items-start gap-2">
                            <Input
                              placeholder="e.g. 1 <= n <= 10^5"
                              value={constraint}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as string[])];
                                  next[constraintIndex] = event.target.value;
                                  return next;
                                })
                              }
                            />
                            {section.data.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  updateSection(section.id, (current) =>
                                    (current as string[]).filter((_, idx) => idx !== constraintIndex),
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "hints" && (
                      <div className="mt-4 space-y-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => updateSection(section.id, (current) => [...(current as string[]), ""])}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add hint
                        </Button>
                        {section.data.map((hint, hintIndex) => (
                          <div key={`hint-${section.id}-${hintIndex}`} className="flex items-start gap-2">
                            <Textarea
                              placeholder="Hint text"
                              value={hint}
                              onChange={(event) =>
                                updateSection(section.id, (current) => {
                                  const next = [...(current as string[])];
                                  next[hintIndex] = event.target.value;
                                  return next;
                                })
                              }
                            />
                            {section.data.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  updateSection(section.id, (current) =>
                                    (current as string[]).filter((_, idx) => idx !== hintIndex),
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preview</p>
                <div className="inline-flex items-center rounded-full border border-border bg-secondary p-1 text-xs">
                  {["summary", "preview"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreviewMode(mode as "summary" | "preview")}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        previewMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      {mode === "summary" ? "Summary" : "Problem view"}
                    </button>
                  ))}
                </div>
              </div>

              {previewMode === "summary" ? (
                <>
                  <h2 className="mt-3 text-2xl font-bold">{previewTitle}</h2>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-border bg-secondary px-3 py-1">{difficulty}</span>
                    {tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full border px-3 py-1",
                          tagPalette[index % tagPalette.length],
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <span className="font-semibold text-foreground">Statement</span>
                      <div
                        className="max-h-24 overflow-hidden rounded-md border border-border bg-background/60 p-2 text-xs prose prose-sm max-w-none text-foreground [&_a]:text-sky-600 [&_a]:underline dark:[&_a]:text-sky-400"
                        dangerouslySetInnerHTML={{
                          __html: statementPreviewHtml || "<p>—</p>",
                        }}
                      />
                    </div>
                    {imageUrls.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-semibold text-foreground">Images</span>
                        <div className="grid grid-cols-3 gap-2">
                          {imageUrls.slice(0, 6).map((url, index) => (
                            <div
                              key={`preview-image-${index}`}
                              className="aspect-square overflow-hidden rounded-md border border-border bg-muted"
                            >
                              <img src={url} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {videoUrls.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-semibold text-foreground">Videos</span>
                        <div className="space-y-1 text-xs">
                          {videoUrls.slice(0, 3).map((url, index) => (
                            <a
                              key={`preview-video-${index}`}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-sky-600 underline dark:text-sky-400"
                            >
                              {`Video link ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <p>
                      <span className="font-semibold text-foreground">Examples</span>: {examplesCount}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Constraints</span>: {constraintsCount}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Hints</span>: {hintsCount}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">{previewTitle}</h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-border bg-secondary px-3 py-1">{difficulty}</span>
                      {tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={cn(
                            "rounded-full border px-3 py-1",
                            tagPalette[index % tagPalette.length],
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {sections.map((section) => {
                      if (section.type === "statement") {
                        return (
                          <div
                            key={`preview-${section.id}`}
                            className={cn(
                              "prose prose-sm max-w-none text-foreground",
                              "[&_a]:text-sky-600 [&_a]:underline dark:[&_a]:text-sky-400",
                              "[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2",
                              "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2",
                              "[&_p]:text-sm [&_p]:leading-relaxed",
                              "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:my-3",
                              "[&_li]:mb-1",
                            )}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: prepareStatementHtml(section.data.html),
                              }}
                            />
                          </div>
                        );
                      }

                      if (section.type === "images") {
                        return (
                          <div key={`preview-${section.id}`} className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Images
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              {section.data
                                .filter((item) => item.url.trim())
                                .map((item, index) => (
                                  <div
                                    key={`preview-image-${section.id}-${index}`}
                                    className="rounded-lg border border-border bg-muted/50 overflow-hidden"
                                  >
                                    <img
                                      src={item.url}
                                      alt={item.caption || `Image ${index + 1}`}
                                      className="h-32 w-full object-cover"
                                    />
                                    {item.caption && (
                                      <p className="px-3 py-2 text-xs text-muted-foreground">{item.caption}</p>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }

                      if (section.type === "videos") {
                        return (
                          <div key={`preview-${section.id}`} className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Videos
                            </h3>
                            <div className="space-y-2">
                              {section.data
                                .filter((item) => item.url.trim())
                                .map((item, index) => (
                                  <div
                                    key={`preview-video-${section.id}-${index}`}
                                    className="p-3 rounded-lg bg-muted/50 border border-border text-sm"
                                  >
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sky-600 underline dark:text-sky-400"
                                    >
                                      {item.caption || `Video link ${index + 1}`}
                                    </a>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }

                      if (section.type === "examples") {
                        return (
                          <div key={`preview-${section.id}`} className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Examples
                            </h3>
                            {section.data.map((example, index) => (
                              <div
                                key={`preview-example-${section.id}-${index}`}
                                className="p-4 rounded-lg bg-muted/50 border border-border space-y-2"
                              >
                                <div className="font-mono text-sm">
                                  <span className="text-muted-foreground">Input: </span>
                                  <span className="text-foreground">{example.input || "—"}</span>
                                </div>
                                <div className="font-mono text-sm">
                                  <span className="text-muted-foreground">Output: </span>
                                  <span className="text-primary">{example.output || "—"}</span>
                                </div>
                                {example.explanation && (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Explanation: </span>
                                    {example.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (section.type === "constraints") {
                        return (
                          <div key={`preview-${section.id}`} className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Constraints
                            </h3>
                            <ul className="space-y-1.5">
                              {section.data.map((constraint, index) => (
                                <li key={`preview-constraint-${section.id}-${index}`} className="flex items-start gap-2 text-sm">
                                  <span className="text-primary mt-1">•</span>
                                  <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {constraint || "—"}
                                  </code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      if (section.type === "hints") {
                        return (
                          <div key={`preview-${section.id}`} className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Hints
                            </h3>
                            <div className="space-y-2">
                              {section.data.map((hint, index) => (
                                <div
                                  key={`preview-hint-${section.id}-${index}`}
                                  className="p-3 rounded-lg bg-medium/10 border border-medium/20 text-sm"
                                >
                                  <span className="font-medium text-medium">Hint {index + 1}: </span>
                                  {hint || "—"}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-sky-500/10 p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Ready to publish?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Preview, validate constraints, then move to test cases and evaluation logic.
              </p>
              <Button className="mt-4 w-full">Continue to test cases</Button>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
}
