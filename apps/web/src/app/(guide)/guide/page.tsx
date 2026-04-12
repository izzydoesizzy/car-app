import Link from "next/link";
import {
  Search,
  Eye,
  ClipboardCheck,
  Handshake,
  Key,
  MapPin,
  Calculator,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Car Buying Guide for Canada",
  description:
    "The complete step-by-step guide to buying a used car in Canada. Province-specific taxes, inspections, negotiation tactics, and essential tools.",
};

const GUIDE_SECTIONS = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "1. Research",
    description: "Set your budget, choose the right car, and know where to look.",
    href: "/guide/research",
    items: ["Budget & total cost", "What to buy", "Where to buy"],
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "2. Finding Cars",
    description: "Spot great deals and avoid scams across Canadian marketplaces.",
    href: "/guide/finding",
    items: ["Red flags", "Decoding ads", "Fair pricing"],
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "3. Inspecting",
    description: "History checks, test drives, and pre-purchase inspections.",
    href: "/guide/inspecting",
    items: ["CARFAX & lien search", "Test drive checklist", "PPI guide", "OBD2 scanning"],
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "4. Making the Deal",
    description: "Negotiate effectively and handle paperwork correctly.",
    href: "/guide/buying",
    items: ["Negotiation tactics", "Required documents", "Safe payment", "Financing"],
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: "5. After Purchase",
    description: "Registration, insurance, and your first week checklist.",
    href: "/guide/ownership",
    items: ["Registration", "Safety certificate", "First week"],
  },
];

const PROVINCES = [
  { code: "ON", name: "Ontario", highlight: "HST 13%, Safety Certificate required" },
  { code: "BC", name: "British Columbia", highlight: "PST 12-20%, ICBC system" },
  { code: "AB", name: "Alberta", highlight: "No PST, no mandatory inspection" },
  { code: "QC", name: "Quebec", highlight: "QST 9.975%, SAAQ" },
  { code: "MB", name: "Manitoba", highlight: "RST 7%, MPI" },
  { code: "SK", name: "Saskatchewan", highlight: "PST 6%, SGI" },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            CarScout
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Link href="/auth/signup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Your Complete Guide to Buying a Used Car in Canada
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From research to keys-in-hand. Province-specific taxes, inspections,
            negotiation tactics, and the tools you need to buy with confidence.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDE_SECTIONS.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="block bg-background border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-primary mb-3">{section.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {section.description}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}

          {/* Tools card */}
          <Link
            href="/guide/tools"
            className="block bg-primary/5 border border-primary/20 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-primary mb-3">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Essential Tools & Services
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              CARFAX, BlueDriver OBD2, CAA inspections, lien searches, and more.
            </p>
          </Link>

          {/* Calculator card */}
          <Link
            href="/guide/calculator"
            className="block bg-background border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-primary mb-3">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Total Cost Calculator
            </h2>
            <p className="text-sm text-muted-foreground">
              Know the real cost before you buy. Calculates taxes, fees, and more by province.
            </p>
          </Link>
        </div>
      </section>

      {/* Province Guides */}
      <section className="bg-muted py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Province-Specific Guides</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVINCES.map((prov) => (
              <Link
                key={prov.code}
                href={`/guide/${prov.name.toLowerCase().replace(/ /g, "-")}`}
                className="bg-background border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-semibold">{prov.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {prov.highlight}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CarScout. Built for Canadian car buyers.
        </div>
      </footer>
    </div>
  );
}
