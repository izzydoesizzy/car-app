import Link from "next/link";
import {
  Search,
  BookOpen,
  Chrome,
  ArrowRight,
  Star,
  Shield,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            CarScout
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/guide"
              className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Buying Guide
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground mb-6">
            Built for Canadian car buyers
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            The smarter way to
            <span className="text-primary"> buy a used car</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Save listings from AutoTrader, Kijiji, Facebook Marketplace and
            more. Compare prices, track negotiations, and follow our
            step-by-step guide to buying with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Tracking Cars <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-6 py-3 rounded-lg text-lg font-medium hover:bg-border transition-colors"
            >
              <BookOpen className="w-5 h-5" /> Read the Buying Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to buy smart
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Chrome className="w-8 h-8 text-primary" />}
              title="Save from Anywhere"
              description="Our Chrome extension lets you save car listings from AutoTrader, Kijiji, Facebook Marketplace, Clutch, and more with one click."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              title="Compare & Negotiate"
              description="Track listed prices vs. Canadian Black Book values. Monitor price drops and build your negotiating position."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-primary" />}
              title="Research Dashboard"
              description="Notes, red flags, inspection checklists, CARFAX links, and seller communication — all in one place per listing."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              title="Used Car Buying Guide"
              description="Province-specific guides covering taxes, inspections, paperwork, and negotiation tactics for every Canadian province."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Essential Tools"
              description="Links to CARFAX Canada, BlueDriver OBD2 scanners, CAA inspections, and lien searches — the tools pros use."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-primary" />}
              title="Total Cost Calculator"
              description="Know the real cost before you buy. Calculates taxes, inspection fees, registration, and insurance by province."
            />
          </div>
        </div>
      </section>

      {/* Supported Marketplaces */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Save listings from
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-muted-foreground">
            {[
              "AutoTrader.ca",
              "Kijiji Autos",
              "Facebook Marketplace",
              "Clutch",
              "CarGurus",
              "Carpages",
              "Auto123",
            ].map((name) => (
              <span
                key={name}
                className="bg-muted px-4 py-2 rounded-lg text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CarScout. Built for Canadian car
            buyers.
          </p>
          <div className="flex gap-6">
            <Link
              href="/guide"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Buying Guide
            </Link>
            <Link
              href="/guide/tools"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tools & Services
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background p-6 rounded-xl border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
