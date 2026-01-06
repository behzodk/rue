import { Header } from "@/components/Header";
import {
  Shield,
  Database,
  Cookie,
  Share2,
  Lock,
  Globe,
  UserCheck,
  Mail,
  RefreshCw,
} from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    icon: Database,
    content: [
      "Account data: name, email, authentication provider, and profile details you submit.",
      "Usage data: pages viewed, problems attempted, submissions, and feature interactions.",
      "Device data: browser type, OS, IP address, and diagnostic logs for reliability.",
    ],
  },
  {
    title: "How We Use Information",
    icon: Shield,
    content: [
      "Provide and improve PacalTower services, personalized content, and analytics.",
      "Secure the platform, detect abuse, and troubleshoot issues.",
      "Communicate product updates, security notices, and support responses.",
    ],
  },
  {
    title: "Cookies & Similar Tech",
    icon: Cookie,
    content: [
      "We use cookies to keep you signed in, remember preferences, and measure performance.",
      "You can disable cookies in your browser, but some features may not work.",
    ],
  },
  {
    title: "Sharing & Disclosure",
    icon: Share2,
    content: [
      "We share data with trusted vendors (hosting, analytics, authentication) under contract.",
      "We disclose data if required by law or to protect users and platform integrity.",
      "We do not sell personal data.",
    ],
  },
  {
    title: "Data Retention",
    icon: Database,
    content: [
      "We keep data as long as your account is active or as needed for legitimate purposes.",
      "You can request deletion; some data may remain for legal or security reasons.",
    ],
  },
  {
    title: "Security",
    icon: Lock,
    content: [
      "We use encryption in transit, access controls, and monitoring to protect data.",
      "No system is 100% secure, but we continuously improve safeguards.",
    ],
  },
  {
    title: "International Transfers",
    icon: Globe,
    content: [
      "Your data may be processed in other countries with different laws.",
      "We use contractual safeguards when transferring data internationally.",
    ],
  },
  {
    title: "Your Rights",
    icon: UserCheck,
    content: [
      "Access, correct, export, or delete your personal data.",
      "Opt out of marketing communications at any time.",
      "Depending on your region, you may have additional rights.",
    ],
  },
  {
    title: "Policy Updates",
    icon: RefreshCw,
    content: [
      "We may update this policy and will post the latest version here.",
      "Material changes will be communicated through the platform or email.",
    ],
  },
  {
    title: "Contact",
    icon: Mail,
    content: ["Questions? Email us at privacy@pacaltower.com."],
  },
];

export default function Privacy() {
  const updatedDate = "March 10, 2025";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Privacy Policy</p>
              <h1 className="mt-3 text-4xl font-bold">Your data, engineered with care</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                This policy explains how PacalTower collects, uses, and protects your information. It is designed to
                be transparent and practical for builders using the platform.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Updated {updatedDate}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.content.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
