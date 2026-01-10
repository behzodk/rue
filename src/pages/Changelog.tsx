import { Header } from "@/components/Header";
import { Calendar, Sparkles } from "lucide-react";

const updates = [
  {
    version: "0.1.0",
    date: "Jan 9, 2026",
    highlights: [
      "Animated mascot turtle Pasco introduced to guide users through the platform.",
      "Problem builder with reorderable sections, rich text editing, and preview modes.",
      "Profile onboarding flow with Supabase-backed profiles and creative creation page.",
      "Google + GitHub authentication with PKCE stability improvements.",
      "Privacy policy and changelog pages with footer links.",
      "Dynamic profile contest rating and live profile data rendering.",
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Changelog</p>
              <h1 className="mt-3 text-4xl font-bold">Product evolution, documented</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Every release ships measurable improvements. Follow along as PacalTower levels up.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Latest updates
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          {updates.map((update) => (
            <div key={update.version} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">v{update.version}</h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{update.date}</span>
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {update.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
