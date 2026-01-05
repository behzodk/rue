import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign, MapPin, PenLine, Sparkles, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

export default function ProfileCreate() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">(
    "idle",
  );
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [profile, navigate]);

  const previewName = useMemo(() => {
    const combined = [firstName, lastName].filter(Boolean).join(" ").trim();
    return combined || "Your Name";
  }, [firstName, lastName]);

  const previewUsername = useMemo(() => {
    const value = username.trim().toLowerCase();
    return value ? `@${value}` : "@your_handle";
  }, [username]);

  const validateUsername = (value: string) => {
    if (value.length < 4) {
      return "Username must be at least 4 characters.";
    }
    if (!/^[a-z]/.test(value)) {
      return "Username must start with a letter.";
    }
    if (!/^[a-z0-9_-]+$/.test(value)) {
      return "Only letters, numbers, underscore, and hyphen are allowed.";
    }
    if (value.length > 24) {
      return "Username must be 24 characters or fewer.";
    }
    return null;
  };

  useEffect(() => {
    const normalized = username.trim().toLowerCase();
    if (!normalized) {
      setUsernameStatus("idle");
      setUsernameMessage(null);
      return;
    }

    const validationError = validateUsername(normalized);
    if (validationError) {
      setUsernameStatus("invalid");
      setUsernameMessage(validationError);
      return;
    }

    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");
    const timeoutId = window.setTimeout(async () => {
      const { data, error: lookupError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", normalized)
        .maybeSingle();
      if (lookupError) {
        setUsernameStatus("invalid");
        setUsernameMessage("Could not validate username. Try again.");
        return;
      }
      if (data) {
        setUsernameStatus("taken");
        setUsernameMessage("That username is already taken.");
        return;
      }
      setUsernameStatus("available");
      setUsernameMessage("Username is available.");
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [username]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("You need to be signed in to create a profile.");
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = user.email?.trim().toLowerCase() ?? "";
    const provider = user.app_metadata?.provider || user.identities?.[0]?.provider || "unknown";

    if (!trimmedFirstName || !trimmedLastName || !normalizedUsername) {
      setError("First name, last name, and username are required.");
      return;
    }

    if (!normalizedEmail) {
      setError("Email is missing from your account. Please try again.");
      return;
    }

    const validationError = validateUsername(normalizedUsername);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (usernameStatus === "taken") {
      setError("That username is already taken.");
      return;
    }

    const { data: hasConflict, error: conflictError } = await supabase.rpc("has_provider_conflict", {
      p_email: normalizedEmail,
      p_provider: provider,
      p_user_id: user.id,
    });
    if (conflictError) {
      setError(conflictError.message);
      return;
    }
    if (hasConflict) {
      setError("This email is already linked to a different sign-in provider.");
      return;
    }

    setIsSubmitting(true);
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      username: normalizedUsername,
      bio: bio.trim() || null,
      location: location.trim() || null,
    });

    if (insertError) {
      setIsSubmitting(false);
      setError(insertError.message);
      return;
    }

    await refreshProfile();
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative z-10 container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4 text-primary" />
                New profile sequence
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Engineer your
                <span className="text-gradient"> creator identity</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Your profile is the control panel for everything you build here. Shape it with the precision of a
                systems architect and the personality of an indie maker.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Identity", detail: "Name, handle, signal", icon: User },
                { title: "Coordinates", detail: "Location and context", icon: MapPin },
                { title: "Intent", detail: "Bio that reads like a mission", icon: PenLine },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Profile spec v1.0</p>
                <span className="text-xs font-mono text-muted-foreground">{"{beta}"}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm font-mono text-muted-foreground">
                <div>{"name: "}<span className="text-foreground">{previewName}</span></div>
                <div>{"username: "}<span className="text-foreground">{previewUsername}</span></div>
                <div>{"status: "}<span className="text-foreground">ready_to_launch</span></div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card/90 p-8 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create your profile</h2>
                <p className="text-sm text-muted-foreground">
                  This only takes a minute. You can edit everything later.
                </p>
              </div>
              <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <AtSign className="h-6 w-6 text-primary" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First name</label>
                  <Input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Ada"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last name</label>
                  <Input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Lovelace"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                  <span className="text-sm text-muted-foreground">@</span>
                  <input
                    className="w-full bg-transparent text-sm focus:outline-none"
                    value={username}
                    onChange={(event) => setUsername(event.target.value.toLowerCase())}
                    placeholder="core_engineer"
                    required
                  />
                </div>
                <p
                  className={cn(
                    "text-xs",
                    usernameStatus === "available" && "text-emerald-500",
                    usernameStatus === "taken" && "text-destructive",
                    usernameStatus === "invalid" && "text-destructive",
                    (usernameStatus === "idle" || usernameStatus === "checking") && "text-muted-foreground",
                  )}
                >
                  {usernameMessage ?? "At least 4 chars, starts with a letter, uses letters/numbers/_-."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Berlin, DE"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell the community what you are building."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  usernameStatus === "checking" ||
                  usernameStatus === "invalid" ||
                  usernameStatus === "taken"
                }
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground",
                  "bg-gradient-to-r from-primary to-sky-500 shadow-lg shadow-primary/20",
                  "transition-transform hover:-translate-y-0.5 hover:shadow-primary/30",
                  isSubmitting && "cursor-not-allowed opacity-70 hover:translate-y-0",
                )}
              >
                {isSubmitting ? "Calibrating profile..." : "Launch profile"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
