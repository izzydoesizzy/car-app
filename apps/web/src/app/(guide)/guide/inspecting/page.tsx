import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardCheck, FileText, Wrench, Car } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 3: Inspecting — CarScout Guide",
  description: "History checks, test drives, and pre-purchase inspections. Everything you need to verify a used car before buying in Canada.",
};

export default function InspectingPage() {
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
          <ClipboardCheck className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Step 3: Inspecting</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          This is where you separate good deals from money pits. Never skip this step.
        </p>

        <div className="space-y-8">
          {/* CARFAX & History */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" /> CARFAX & History Checks
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Before you even see the car in person, run these checks:</p>
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">1. CARFAX Canada Report ($55.95+)</h3>
                  <p>Shows accident history, service records, odometer readings, registration history, and lien information. Many dealers include a free CARFAX — always ask first.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">2. PPSA Lien Search ($8-$22)</h3>
                  <p>Check if anyone has a financial claim on the vehicle. If there&apos;s a lien, the seller must provide proof of discharge before you pay. Each province has its own registry.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">3. VIN Decode (Free)</h3>
                  <p>Verify the vehicle&apos;s specs match what the seller claims. CarScout decodes VINs automatically using the NHTSA database. Mismatches between the VIN and the listing are a red flag for fraud.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">4. Transport Canada Recalls (Free)</h3>
                  <p>Check for outstanding safety recalls. Recall repairs are always free at authorized dealers. CarScout checks this automatically on the listing detail page.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Test Drive Checklist */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-primary" /> Test Drive Checklist
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Before starting the car:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Walk around the car — check for mismatched paint, uneven panel gaps, rust</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Check tire tread depth and wear pattern (uneven wear = alignment or suspension issues)</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Open the hood — check for leaks, corrosion, aftermarket parts</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Check under the car — look for rust on the frame, subframe, and rocker panels</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Plug in your OBD2 scanner (BlueDriver) — check for stored and pending codes</li>
              </ul>

              <p className="font-medium text-foreground">Cold start (try to arrive before the seller warms it up):</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Listen for unusual noises on startup (ticking, knocking, squealing)</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Check exhaust smoke color: white = head gasket, blue = burning oil, black = running rich</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> All dashboard warning lights should come on then go off</li>
              </ul>

              <p className="font-medium text-foreground">During the drive (at least 20 minutes, mixed roads):</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Transmission shifts smoothly (no hesitation, jerking, or slipping)</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Brakes are firm with no pulling, pulsation, or grinding</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Steering is straight with no drift or vibration</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Test AC, heat, all windows, locks, infotainment</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Drive over bumps — listen for suspension clunks</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Highway speed — check for vibrations, wind noise, alignment pull</li>
              </ul>
            </div>
          </section>

          {/* Pre-Purchase Inspection */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" /> Pre-Purchase Inspection (PPI)
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                If the test drive goes well, get a professional inspection before making an offer. This is non-negotiable for private sales.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">CAA Inspection</h3>
                  <p>From $199. Certified technician comes to the vehicle. Comprehensive report covering engine, transmission, brakes, suspension, exhaust, electrical, body, and frame.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">iNeedaPPi</h3>
                  <p>$189.99. Mobile inspector with 50+ photos/videos, a 0-100 condition score, and repair cost estimates. Often same-day availability.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Your Own Mechanic</h3>
                  <p>$100-$200. If you have a trusted mechanic, ask if they do PPIs. Bring the car to them — don&apos;t use the seller&apos;s recommended shop.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">If They Refuse...</h3>
                  <p className="font-medium text-red-700">Walk away. A seller who won&apos;t allow a third-party inspection is hiding something. No exceptions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* OBD2 Scanning */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" /> OBD2 Scanning
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>A <strong className="text-foreground">BlueDriver OBD2 scanner</strong> ($85-$120, one-time purchase) is the single best investment you can make as a used car buyer.</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Stored codes:</strong> Current problems the car is experiencing</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Pending codes:</strong> Issues that are developing but haven&apos;t triggered the check engine light yet</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Emissions readiness:</strong> If monitors show &ldquo;not ready,&rdquo; codes were recently cleared — this is a major red flag</li>
                <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> <strong className="text-foreground">Live data:</strong> Monitor engine temperature, fuel trims, and other parameters in real time</li>
              </ul>
              <p>Works with any 1996+ vehicle. Plug it in under the dashboard before starting the car.</p>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <Link href="/guide/finding" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Previous: Finding Cars
          </Link>
          <Link href="/guide/buying" className="text-sm text-primary hover:underline flex items-center gap-1">
            Next: Making the Deal <ArrowRight className="w-4 h-4" />
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
