import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, AlertTriangle, Search, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 2: Finding Cars — CarScout Guide",
  description: "Spot great deals and avoid scams across Canadian marketplaces. Learn to decode listings and identify red flags.",
};

export default function FindingPage() {
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
          <Eye className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Step 2: Finding Cars</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Spot great deals, avoid scams, and learn to read between the lines of every listing.
        </p>

        <div className="space-y-8">
          {/* Red Flags */}
          <section className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-800">
              <AlertTriangle className="w-5 h-5" /> Red Flags to Watch For
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-red-800">
              <div className="space-y-2">
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Price too good to be true (20%+ below market)</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Seller won&apos;t let you do a pre-purchase inspection</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> No VIN provided or reluctant to share</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Pressure to decide quickly (&ldquo;other buyers interested&rdquo;)</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Wants payment by e-transfer or crypto only</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Suspiciously low mileage for the year</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Multiple owners in a short period</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Listing has only 1-2 photos or stock photos</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Won&apos;t meet in person or at a public place</p>
                <p className="flex items-start gap-2"><span className="font-bold">!</span> Salvage/rebuilt title not disclosed upfront</p>
              </div>
            </div>
          </section>

          {/* Decoding Listings */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" /> Decoding Listings
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Sellers use specific language to minimize issues. Here&apos;s what common phrases actually mean:</p>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">&ldquo;As-is&rdquo; / &ldquo;Sold as-is where-is&rdquo;</p>
                  <p>No warranty, no safety certificate. You accept all risk. Budget for $500-$2,000 in potential repairs.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">&ldquo;Certified&rdquo; / &ldquo;Safetied&rdquo;</p>
                  <p>Has passed a safety inspection. Doesn&apos;t mean the car is in great shape — just that it meets minimum safety standards.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">&ldquo;Clean title&rdquo;</p>
                  <p>No salvage or rebuilt brand. But it can still have accident history — &ldquo;clean title&rdquo; just means the damage wasn&apos;t severe enough to be written off.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">&ldquo;Runs and drives&rdquo;</p>
                  <p>The absolute bare minimum. Often means there ARE issues, but the car moves under its own power.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">&ldquo;Minor rust&rdquo; / &ldquo;Some rust&rdquo;</p>
                  <p>Almost always means significant rust. If a seller mentions rust at all, expect it to be worse than described.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Fair Pricing */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" /> How to Spot a Fair Price
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Use multiple sources to triangulate the right price:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-primary">1.</span> <strong className="text-foreground">Canadian Black Book (CBB)</strong> — CarScout shows the CBB range on every listing. If the asking price is above the CBB &ldquo;high&rdquo; value, the seller is overpriced.</li>
                <li className="flex items-start gap-2"><span className="text-primary">2.</span> <strong className="text-foreground">Kelley Blue Book Canada</strong> — Free at <Link href="https://www.kbb.ca/en-ca" className="text-primary hover:underline">kbb.ca</Link>. Get trade-in and private party values.</li>
                <li className="flex items-start gap-2"><span className="text-primary">3.</span> <strong className="text-foreground">Compare 5+ similar listings</strong> — Same year, make, model, similar mileage. Sort by price on AutoTrader or Kijiji to see the range.</li>
                <li className="flex items-start gap-2"><span className="text-primary">4.</span> <strong className="text-foreground">Check CarGurus deal ratings</strong> — Their algorithm compares to market and rates deals from &ldquo;Great&rdquo; to &ldquo;Overpriced&rdquo;.</li>
              </ul>
              <div className="bg-muted/50 rounded-lg p-4 mt-3">
                <p className="font-medium text-foreground mb-1">Pro tip: Track price drops</p>
                <p>CarScout records price history on every saved listing. If a car has been listed for 30+ days without selling, the seller is usually more willing to negotiate.</p>
              </div>
            </div>
          </section>

          {/* Curbsiders */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" /> Curbsiders: Canada&apos;s Biggest Scam
            </h2>
            <div className="space-y-3 text-sm text-yellow-800">
              <p>
                <strong>Curbsiders</strong> are unlicensed dealers who pose as private sellers. They buy damaged or problematic cars cheaply, cosmetically fix them, and flip them at market price. This is illegal across Canada but still common.
              </p>
              <p>How to spot them:</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2"><span>&#x2022;</span> Multiple cars listed by the same phone number — search the number on Kijiji/Facebook</li>
                <li className="flex items-start gap-2"><span>&#x2022;</span> The ownership has changed hands multiple times recently (check UVIP in Ontario)</li>
                <li className="flex items-start gap-2"><span>&#x2022;</span> Name on the ownership doesn&apos;t match the seller</li>
                <li className="flex items-start gap-2"><span>&#x2022;</span> They know suspiciously little about the car&apos;s history</li>
                <li className="flex items-start gap-2"><span>&#x2022;</span> Meeting location is a random parking lot, not their home</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <Link href="/guide/research" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Previous: Research
          </Link>
          <Link href="/guide/inspecting" className="text-sm text-primary hover:underline flex items-center gap-1">
            Next: Inspecting <ArrowRight className="w-4 h-4" />
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
