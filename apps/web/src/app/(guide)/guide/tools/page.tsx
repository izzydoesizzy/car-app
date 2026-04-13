import Link from "next/link";
import { ArrowLeft, ExternalLink, Shield, Wrench, Search, FileText, ClipboardCheck, DollarSign } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essential Tools & Services — CarScout Guide",
  description: "CARFAX Canada, BlueDriver OBD2, CAA inspections, lien searches, and other essential tools for buying a used car in Canada.",
};

const TOOLS = [
  {
    name: "CARFAX Canada",
    icon: <FileText className="w-6 h-6" />,
    category: "Vehicle History",
    description: "The industry standard for vehicle history reports in Canada. Shows accident history, service records, odometer readings, registration history, and lien information.",
    pricing: "From $55.95 per report",
    when: "Before making an offer on any vehicle you're serious about. Essential for both private and dealer purchases.",
    url: "https://www.carfax.ca",
    tips: [
      "Many dealers include a free CARFAX report — always ask before paying for your own",
      "CARFAX is the only source that aggregates data from all Canadian insurance companies",
      "A clean CARFAX doesn't guarantee a perfect car — it only reports what was reported to insurance",
    ],
  },
  {
    name: "BlueDriver OBD2 Scanner",
    icon: <Wrench className="w-6 h-6" />,
    category: "Diagnostic Tool",
    description: "A Bluetooth OBD2 scanner that connects to your phone. Reads and clears diagnostic trouble codes, monitors live engine data, and runs emissions readiness checks.",
    pricing: "$85-$120 on Amazon.ca",
    when: "Bring it to every test drive. Plug into the OBD-II port (under the dashboard) before you start the car. Check for stored and pending codes.",
    url: "https://www.amazon.ca/s?k=bluedriver+obd2",
    tips: [
      "If the seller recently cleared codes, you'll see 'monitors not ready' — this is a red flag",
      "Works with any 1996+ vehicle with a standard OBD-II port",
      "The free BlueDriver app provides detailed code explanations and likely fixes",
      "One-time purchase that pays for itself on the first car you avoid buying",
    ],
  },
  {
    name: "CAA Pre-Purchase Inspection",
    icon: <Shield className="w-6 h-6" />,
    category: "Professional Inspection",
    description: "A certified CAA technician performs a comprehensive on-site inspection of the vehicle. Covers engine, transmission, brakes, suspension, exhaust, electrical, body, and frame.",
    pricing: "From $199 (varies by region)",
    when: "After the test drive, before making an offer. Especially important for private sales where there's no dealer warranty.",
    url: "https://www.caa.ca",
    tips: [
      "CAA inspectors come to you — they inspect wherever the vehicle is located",
      "The report is detailed and impartial — great leverage for negotiation",
      "If the seller refuses to allow a third-party inspection, walk away",
      "Some CAA memberships include a discount on inspections",
    ],
  },
  {
    name: "PPSA Lien Search",
    icon: <Search className="w-6 h-6" />,
    category: "Lien Verification",
    description: "Search the Personal Property Security Registration to check for outstanding liens on a vehicle. A lien means someone else has a financial claim — the vehicle could be repossessed even after you buy it.",
    pricing: "$8-$14 per search (varies by province)",
    when: "Before finalizing any private sale. Dealers are legally required to clear liens before selling.",
    url: "https://www.ontario.ca/page/search-personal-property-security-registration",
    tips: [
      "Each province has its own registry — search in the province where the vehicle is registered",
      "Ontario: ontario.ca/PPSA ($8), BC: bcregistry.gov.bc.ca ($11), Alberta: alberta.ca/PPR ($10)",
      "If a lien exists, the seller must provide proof of discharge before you pay",
      "Some third-party services like EasyPPSA.ca search multiple provinces at once",
    ],
  },
  {
    name: "VIN Decoder (NHTSA)",
    icon: <Search className="w-6 h-6" />,
    category: "Vehicle Verification",
    description: "Free VIN decoding service from the National Highway Traffic Safety Administration. Returns manufacturer specs including make, model, year, trim, engine, drivetrain, and body type. Use it to verify the seller's claims.",
    pricing: "Free",
    when: "As soon as you have the VIN. Compare decoded specs to what the seller advertised — mismatches are a red flag for fraud.",
    url: "https://vpic.nhtsa.dot.gov/decoder/",
    tips: [
      "CarScout has VIN decoding built in — just enter the VIN on any listing",
      "The VIN year code (position 10) can't be faked — it's checked against the full VIN checksum",
      "If the decoded make/model doesn't match the listing, the VIN may be cloned from another vehicle",
    ],
  },
  {
    name: "Transport Canada Recalls",
    icon: <Shield className="w-6 h-6" />,
    category: "Safety Recalls",
    description: "Check Transport Canada's Vehicle Recall Database for any outstanding safety recalls. Recalls are free to fix at any authorized dealer — but only if you know about them.",
    pricing: "Free",
    when: "Before finalizing any purchase. Outstanding recalls don't prevent a sale, but they should be addressed before driving.",
    url: "https://tc.canada.ca/en/recalls-safety-alerts",
    tips: [
      "CarScout can check recalls automatically from the listing detail page",
      "Recall repairs are always free at authorized dealers — even after warranty expires",
      "Some recalls are safety-critical (airbags, brakes) — prioritize these",
    ],
  },
  {
    name: "iNeedaPPi",
    icon: <ClipboardCheck className="w-6 h-6" />,
    category: "Mobile Inspection",
    description: "A certified mobile inspector comes to the vehicle's location and performs a comprehensive pre-purchase inspection. You get 50+ photos and videos, a condition score out of 100, and repair cost estimates — all delivered by email within an hour.",
    pricing: "$189.99 (add-ons: market appraisal +$20, warranty from $49)",
    when: "After the test drive, before making an offer. Great alternative to CAA inspections with faster turnaround and more detailed photo documentation.",
    url: "https://ineedappi.ca",
    tips: [
      "Same-day service is often available — book early in the day for best availability",
      "The condition score (0-100) gives you an objective benchmark for negotiation",
      "The optional market price appraisal (+$20) tells you if the asking price is fair",
      "Reports include estimated repair costs — use these as negotiation leverage",
      "Available in Toronto, Vancouver, Calgary, Edmonton, and expanding to more cities",
    ],
  },
  {
    name: "Kelley Blue Book Canada",
    icon: <DollarSign className="w-6 h-6" />,
    category: "Vehicle Valuation",
    description: "Look up fair market value, trade-in value, and private party value for any vehicle. KBB is one of the most recognized vehicle valuation tools in North America, now available for the Canadian market.",
    pricing: "Free",
    when: "During your research phase and before making an offer. Compare KBB values with Canadian Black Book and the seller's asking price to understand if the deal is fair.",
    url: "https://www.kbb.ca/en-ca",
    tips: [
      "Compare KBB values with Canadian Black Book (CBB) — they sometimes differ significantly",
      "Trade-in value is always lower than private party value — know which one applies to your situation",
      "Adjust for mileage, condition, and optional equipment to get the most accurate estimate",
      "Use the KBB value as a data point in negotiation — sellers respond to objective pricing data",
    ],
  },
];

export default function ToolsPage() {
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

        <h1 className="text-3xl font-bold mb-2">Essential Tools & Services</h1>
        <p className="text-muted-foreground mb-8">
          The tools Canadian car buyers actually need. Each one earns its place in your toolkit.
        </p>

        <div className="space-y-6">
          {TOOLS.map((tool) => (
            <section key={tool.name} className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-primary">{tool.icon}</div>
                  <div>
                    <h2 className="text-lg font-semibold">{tool.name}</h2>
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                  </div>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline whitespace-nowrap"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Cost</p>
                  <p className="font-medium">{tool.pricing}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">When to Use</p>
                  <p className="font-medium">{tool.when}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tips</h3>
                <ul className="space-y-1">
                  {tool.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">&#x2022;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
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
