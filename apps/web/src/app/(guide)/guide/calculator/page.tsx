import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TotalCostCalculator } from "@/components/listings/total-cost-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provincial Tax Calculator — CarScout Guide",
  description: "Calculate the total cost of buying a used car in any Canadian province. Includes GST/HST, PST/QST, safety inspection, lien search, and UVIP fees.",
};

export default function CalculatorPage() {
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Guide
        </Link>

        <h1 className="text-3xl font-bold mb-2">Provincial Tax Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Find out exactly what you&apos;ll pay when buying a used car in your province. Includes all taxes, mandatory fees, and government charges.
        </p>

        <TotalCostCalculator />

        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">How It Works</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#x2022;</span>
                Enter the purchase price and select your province
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#x2022;</span>
                The calculator applies the correct GST/HST and provincial sales tax for your region
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#x2022;</span>
                Mandatory fees like safety inspections, lien searches, and UVIP (Ontario) are included
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#x2022;</span>
                The total is an estimate &mdash; insurance, financing, and optional add-ons are not included
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Tax Differences by Province</h2>
            <p>
              Canadian provinces use different tax structures. Ontario, New Brunswick, Nova Scotia, Newfoundland, and PEI charge a combined HST.
              British Columbia, Saskatchewan, and Manitoba charge GST plus a separate provincial sales tax.
              Quebec charges GST plus QST. Alberta charges only GST (no provincial sales tax), making it the cheapest province for vehicle purchases tax-wise.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Private Sale vs. Dealer</h2>
            <p>
              In most provinces, private sale tax is calculated on the purchase price or the wholesale value &mdash; whichever is higher.
              Dealer purchases always include tax on the full sale price. Some provinces (like Ontario) charge RST on private sales at a different rate than HST.
            </p>
          </section>

          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs">
              <strong className="text-foreground">Disclaimer:</strong> This calculator provides estimates for informational purposes only.
              Actual costs may vary based on your specific situation, vehicle value assessments, and any changes to provincial tax rates or fees.
              Always confirm with your provincial licensing authority before completing a purchase.
            </p>
          </div>
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
