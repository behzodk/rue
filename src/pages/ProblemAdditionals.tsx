import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

type Visibility = "public" | "private";

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function ProblemAdditionals() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [slug, setSlug] = useState("");
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testCasesJson, setTestCasesJson] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Missing problem ID.");
      setIsLoading(false);
      return;
    }

    const loadProblem = async () => {
      const { data, error: loadError } = await supabase
        .from("problems")
        .select("id, title, is_public, slug, author_id")
        .eq("id", id)
        .single();

      if (loadError || !data) {
        setError(loadError?.message ?? "Problem not found.");
        setIsLoading(false);
        return;
      }

      if (user && data.author_id !== user.id) {
        setError("You do not have access to update this problem.");
        setIsLoading(false);
        return;
      }

      setTitle(data.title ?? "");
      setVisibility(data.is_public === false ? "private" : "public");
      setSlug(data.slug ?? "");
      setIsLoading(false);
    };

    void loadProblem();
  }, [id, user]);

  const normalizedSlug = useMemo(() => normalizeSlug(slug), [slug]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0] ?? null;
    setTestFile(file);
    setTestCasesJson(null);

    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setTestCasesJson(parsed);
    } catch (parseError) {
      setError("Test cases must be valid JSON.");
      setTestCasesJson(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be signed in to update a problem.");
      return;
    }
    if (!id) {
      setError("Missing problem ID.");
      return;
    }

    const isPublic = visibility === "public";
    const slugToUse = isPublic ? normalizedSlug : null;

    if (isPublic) {
      if (!normalizedSlug) {
        setError("Slug is required for public problems.");
        return;
      }
      if (!slugPattern.test(normalizedSlug)) {
        setError("Slug can only include lowercase letters, numbers, and hyphens.");
        return;
      }

      const { data: slugHit, error: slugError } = await supabase
        .from("problems")
        .select("id")
        .eq("slug", normalizedSlug)
        .neq("id", id)
        .maybeSingle();

      if (slugError) {
        setError(slugError.message);
        return;
      }
      if (slugHit) {
        setError("That slug is already taken.");
        return;
      }
    }

    if (testFile && !testCasesJson) {
      setError("Test cases must be valid JSON.");
      return;
    }

    setIsSaving(true);

    let testCasesPayload: Record<string, unknown> | null = null;
    if (testFile && testCasesJson) {
      const filePath = `${id}/${Date.now()}-${testFile.name}`;
      const { error: uploadError } = await supabase.storage.from("test_cases").upload(filePath, testFile, {
        upsert: true,
        contentType: "application/json",
      });
      if (uploadError) {
        setIsSaving(false);
        setError(uploadError.message);
        return;
      }
      testCasesPayload = {
        storage_path: filePath,
        file_name: testFile.name,
        uploaded_at: new Date().toISOString(),
        data: testCasesJson,
      };
    }

    const updateFields: Record<string, unknown> = {
      is_public: isPublic,
      slug: slugToUse,
      updated_at: new Date().toISOString(),
    };
    if (testCasesPayload) {
      updateFields.test_cases = testCasesPayload;
    }

    const { error: updateError } = await supabase.from("problems").update(updateFields).eq("id", id);
    if (updateError) {
      setIsSaving(false);
      setError(updateError.message);
      return;
    }

    setIsSaving(false);
    navigate(`/problem/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-10">
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading problem settings...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <div className="max-w-3xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Additionals</p>
            <h1 className="text-2xl font-semibold">Finalize “{title || "Untitled problem"}”</h1>
            <p className="text-sm text-muted-foreground">
              Control visibility, assign a slug for public problems, and upload test cases.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-3">
              <Label>Visibility</Label>
              <RadioGroup
                value={visibility}
                onValueChange={(value) => setVisibility(value as Visibility)}
                className="grid gap-3 md:grid-cols-2"
              >
                <label className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm cursor-pointer">
                  <RadioGroupItem value="public" />
                  <div>
                    <p className="font-medium">Public</p>
                    <p className="text-muted-foreground text-xs">Discoverable and available to everyone.</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm cursor-pointer">
                  <RadioGroupItem value="private" />
                  <div>
                    <p className="font-medium">Private</p>
                    <p className="text-muted-foreground text-xs">Visible only to you.</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {visibility === "public" && (
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="two-sum"
                />
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and hyphens. Normalized slug:{" "}
                  <span className="font-medium text-foreground">{normalizedSlug || "—"}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="test-cases">Test cases JSON</Label>
              <Input
                id="test-cases"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload a JSON file. It will be stored in the `test_cases` bucket and saved to the problem record.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save and continue"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
