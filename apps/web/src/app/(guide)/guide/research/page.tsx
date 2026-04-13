import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, DollarSign, Car, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 1: Research — CarScout Guide",
  description: "Set your budget, choose the right car, and know where to look. The essential first step in buying a used car in Canada.",
};

export default function ResearchPage() {
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
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Step 1: Research</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Before browsing a single listing, get clear on what you can afford and what you actually need.
        </p>

        <div className="space-y-8">
          {/* Budget */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" /> Setting Your Budget
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Your budget isn&apos;t just the sticker price. A $15,000 car can easily cost $18,000+ after taxes, fees, and immediate maintenance. Here&apos;s what to account for:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span>Purchase price</span><span className="font-medium text-foreground">$15,000</span></div>
                <div className="flex justify-between"><span>Provincial tax (e.g. 13% HST in ON)</span><span className="font-medium text-foreground">$1,950</span></div>
                <div className="flex justify-between"><span>Safety inspection</span><span className="font-medium text-foreground">$100</span></div>
                <div className="flex justify-between"><span>Lien search</span><span className="font-medium text-foreground">$8</span></div>
                <div className="flex justify-between"><span>UVIP (Ontario)</span><span className="font-medium text-foreground">$20</span></div>
                <div className="flex justify-between"><span>Registration + plates</span><span className="font-medium text-foreground">$90</span></div>
                <div className="flex justify-between"><span>First oil change + fluids</span><span className="font-medium text-foreground">$150</span></div>
                <div className="flex justify-between"><span>Winter tires (if needed)</span><span className="font-medium text-foreground">$800</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground">
                  <span>Realistic total</span><span className="text-primary">$18,118</span>
                </div>
              </div>
              <p>
                Use our <Link href="/guide/calculator" className="text-primary hover:underline">Total Cost Calculator</Link> to get an accurate estimate for your province.
              </p>
            </div>
          </section>

          {/* What to Buy */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-primary" /> Choosing the Right Car
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Make a list of <strong className="text-foreground">needs</strong> (non-negotiable) vs <strong className="text-foreground">wants</strong> (nice-to-have). Be honest with yourself.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Questions to Answer</h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> How many passengers regularly?</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> City driving, highway, or mixed?</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Do you need AWD/4WD for winter?</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> How much cargo space?</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Fuel economy priority?</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Parking constraints (downtown condo)?</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Reliability Sweet Spot</h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong>3-5 years old</strong>: best value-to-reliability ratio</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong>60,000-100,000 km</strong>: well broken in, lots of life left</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Honda/Toyota tend to hold value but cost more upfront</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Hyundai/Kia are great value — check for recall status</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Avoid first model years of any generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Where to Buy */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" /> Where to Buy
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 font-medium text-foreground">Source</th>
                      <th className="pb-2 font-medium text-foreground">Pros</th>
                      <th className="pb-2 font-medium text-foreground">Cons</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-2 pr-4 font-medium text-foreground">Dealer</td><td className="py-2 pr-4">Warranty, financing, OMVIC protection (ON)</td><td className="py-2">Higher price, pressure tactics</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-foreground">Private</td><td className="py-2 pr-4">Lower price, negotiate directly</td><td className="py-2">No warranty, more risk</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-foreground">Online (Clutch)</td><td className="py-2 pr-4">Convenience, return policy</td><td className="py-2">Can&apos;t inspect in person first</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-foreground">Auction</td><td className="py-2 pr-4">Lowest prices possible</td><td className="py-2">As-is, no recourse, need expertise</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                CarScout supports <strong className="text-foreground">AutoTrader, Kijiji, Facebook Marketplace, Clutch, CarGurus, Carpages, and Auto123</strong>. Save listings from any of them to compare in one place.
              </p>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <Link href="/guide" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Guide Overview
          </Link>
          <Link href="/guide/finding" className="text-sm text-primary hover:underline flex items-center gap-1">
            Next: Finding Cars <ArrowRight className="w-4 h-4" />
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
