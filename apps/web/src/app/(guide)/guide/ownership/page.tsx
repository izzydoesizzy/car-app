import Link from "next/link";
import { ArrowLeft, Key, Shield, FileText, Wrench, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 5: After Purchase — CarScout Guide",
  description: "Registration, insurance, safety certificates, and your first week checklist after buying a used car in Canada.",
};

export default function OwnershipPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">CarScout</Link>
          <div className="flex items-center gap-4">
            <Link href="/guide" className="text-sm text-muted-foreground hover:text-foreground">Back to Guide</Link>
            <Link href="/auth/signup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg">Get Started</Link>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Guide
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Key className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Step 5: After Purchase</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          You bought the car. Now make sure you&apos;re legal, protected, and set up for trouble-free ownership.
        </p>

        <div className="space-y-8">
          {/* Registration */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" /> Registration & Transfer
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Do this immediately — you cannot legally drive an unregistered vehicle.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <p className="font-medium mb-2">Registration deadlines vary by province:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <span>Ontario: 6 days</span>
                  <span>Quebec: 30 days</span>
                  <span>New Brunswick: 10 days</span>
                  <span>BC: Immediately</span>
                  <span>Alberta: Immediately</span>
                  <span>Manitoba: Immediately</span>
                </div>
              </div>
              <p>What to bring to your provincial registry:</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Signed bill of sale</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Signed vehicle ownership/permit</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Valid insurance (must have BEFORE registering)</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Safety certificate (if required in your province)</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Government ID</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Payment for registration fees + applicable taxes</li>
              </ul>
              <p>
                Check your <Link href="/guide" className="text-primary hover:underline">province-specific guide</Link> for exact requirements and costs.
              </p>
            </div>
          </section>

          {/* Insurance */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" /> Insurance
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">You need insurance BEFORE driving the car home.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Private Insurance Provinces</h3>
                  <p>ON, AB, NB, NS, PE, NL — shop around. Get at least 3 quotes. Check: Sonnet, Belairdirect, TD Insurance, Intact, Wawanesa, your bank.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Public Insurance Provinces</h3>
                  <p>BC (ICBC), MB (MPI), SK (SGI) — basic coverage is through the public insurer. You can shop for optional/extended coverage (BC, SK) or it&apos;s all through MPI (MB).</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Quebec (Hybrid)</h3>
                  <p>SAAQ covers bodily injury (included in registration). You must buy property/liability from a private insurer: Intact, Desjardins, La Capitale, etc.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Ways to Save</h3>
                  <ul className="space-y-1 mt-1">
                    <li>&#x2022; Bundle with home/tenant insurance</li>
                    <li>&#x2022; Install winter tires (some give discounts)</li>
                    <li>&#x2022; Higher deductible = lower premium</li>
                    <li>&#x2022; Ask about usage-based/telematics programs</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Certificate */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" /> Safety Certificate
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>If you bought the car &ldquo;as-is&rdquo; (without a safety certificate), you&apos;ll need to get one to register it. This is required in most provinces for private sales.</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">Province-by-Province Requirements</h3>
                <div className="space-y-1.5">
                  <p><strong>Required:</strong> Ontario (SSC, valid 36 days), Manitoba, Nova Scotia (MVI, valid 2 years), New Brunswick (10-day deadline), PEI, Newfoundland</p>
                  <p><strong>Not required for in-province:</strong> British Columbia, Alberta, Saskatchewan, Quebec (unless 8+ years old or salvage)</p>
                  <p><strong>Cost:</strong> $40-$200 depending on province and shop. If it fails, you pay for the repairs and a re-inspection.</p>
                </div>
              </div>
              <p>
                <strong className="text-foreground">Tip:</strong> Choose YOUR own inspection station, not the seller&apos;s. Some shops have a financial incentive to pass vehicles that shouldn&apos;t pass.
              </p>
            </div>
          </section>

          {/* First Week Checklist */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" /> Your First Week Checklist
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Do all of these within the first 7 days of ownership:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 1</span> <span>Get insurance, register the vehicle, get plates</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 1-2</span> <span>Get a safety inspection (if buying as-is and required by your province)</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 1-3</span> <span>Complete PPSA lien search if not already done</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 1-3</span> <span>Change oil and check all fluids (don&apos;t trust the seller&apos;s claim)</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 1-5</span> <span>Address any outstanding safety recalls at a dealer (free)</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 3-7</span> <span>Check tire pressure, spare tire condition, and winter tires (if seasonal)</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold">Day 7</span> <span>File all documents together: bill of sale, ownership, insurance, safety cert, CARFAX, PPI report</span></li>
              </ul>
            </div>
          </section>

          {/* Ongoing */}
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Ongoing: Protect Your Investment</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Keep all receipts:</strong> Service records increase resale value and prove maintenance history</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Follow the maintenance schedule:</strong> The owner&apos;s manual has exact intervals for oil, brakes, timing belt, etc.</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Don&apos;t ignore warning lights:</strong> Small problems become expensive problems fast</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Seasonal prep:</strong> Winter tires by November, summer tires by April. Rust-proof annually if you&apos;re in an eastern province</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Track with CarScout:</strong> Update your listing status to &ldquo;purchased&rdquo; to unlock the post-purchase checklist with province-specific steps</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <Link href="/guide/buying" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Previous: Making the Deal
          </Link>
          <Link href="/guide" className="text-sm text-primary hover:underline flex items-center gap-1">
            Back to Guide Overview
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-muted rounded-xl p-8">
          <h2 className="text-xl font-bold mb-2">Ready to start your car search?</h2>
          <p className="text-muted-foreground mb-4">
            Track listings, compare prices, and buy with confidence.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CarScout. Built for Canadian car buyers.
        </div>
      </footer>
    </div>
  );
}
