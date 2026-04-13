import Link from "next/link";
import { ArrowLeft, ArrowRight, Handshake, DollarSign, FileText, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 4: Making the Deal — CarScout Guide",
  description: "Negotiate effectively, handle paperwork correctly, and pay safely when buying a used car in Canada.",
};

export default function BuyingPage() {
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
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Step 4: Making the Deal</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          You&apos;ve found the car and it passed inspection. Now it&apos;s time to negotiate, handle paperwork, and close the deal safely.
        </p>

        <div className="space-y-8">
          {/* Negotiation */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" /> Negotiation Tactics
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Golden rule: whoever names a number first usually loses. Let the seller set the price, then work down.</p>

              <h3 className="font-medium text-foreground mt-4">Your leverage points:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-primary">1.</span> <strong className="text-foreground">Market data:</strong> &ldquo;CBB/KBB values this at $X. Similar cars on AutoTrader are listed at $Y.&rdquo;</li>
                <li className="flex items-start gap-2"><span className="text-primary">2.</span> <strong className="text-foreground">Inspection findings:</strong> &ldquo;The PPI found $X in needed repairs. I need to factor that into my offer.&rdquo;</li>
                <li className="flex items-start gap-2"><span className="text-primary">3.</span> <strong className="text-foreground">Accident history:</strong> &ldquo;CARFAX shows a previous accident. That reduces market value by 10-20%.&rdquo;</li>
                <li className="flex items-start gap-2"><span className="text-primary">4.</span> <strong className="text-foreground">Days on market:</strong> &ldquo;This has been listed for 45 days. Clearly the current price isn&apos;t attracting buyers.&rdquo;</li>
                <li className="flex items-start gap-2"><span className="text-primary">5.</span> <strong className="text-foreground">Cash offer:</strong> &ldquo;I can pay in full today with a bank draft if we can agree on $X.&rdquo;</li>
              </ul>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-3">
                <h3 className="font-medium text-green-800 mb-1">How much to offer</h3>
                <ul className="space-y-1 text-green-800">
                  <li className="flex items-start gap-2"><span>&#x2713;</span> <strong>Private sale:</strong> Start 10-15% below asking. Expect to settle 5-10% below.</li>
                  <li className="flex items-start gap-2"><span>&#x2713;</span> <strong>Dealer:</strong> Less room to negotiate (3-7%), but ask for extras: winter tires, extended warranty, free oil changes.</li>
                  <li className="flex items-start gap-2"><span>&#x2713;</span> <strong>With issues:</strong> Deduct the repair cost from your offer and show the PPI report as proof.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Required Documents */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" /> Required Documents
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Before you hand over money, make sure you have or will receive:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">From the Seller</h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Signed bill of sale (both parties)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Vehicle ownership/registration signed over</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Safety certificate (if &ldquo;certified&rdquo;)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> UVIP (Ontario — legally required)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> All keys and remotes</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Service records (if available)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x25A1;</span> Lien discharge proof (if applicable)</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">What the Bill of Sale Must Include</h3>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Full names and addresses of buyer and seller</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Vehicle make, model, year, VIN</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Odometer reading at time of sale</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Purchase price (this is what you pay tax on)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Date of sale</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> &ldquo;As-is&rdquo; or &ldquo;certified&rdquo; declaration</li>
                    <li className="flex items-start gap-2"><span className="text-primary">&#x2022;</span> Signatures of both parties</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Safe Payment */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" /> Safe Payment Methods
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 font-medium text-foreground">Method</th>
                      <th className="pb-2 font-medium text-foreground">Safety</th>
                      <th className="pb-2 font-medium text-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-2 pr-4 font-medium text-green-700">Bank draft</td><td className="py-2 pr-4 text-green-700">Safest</td><td className="py-2">Go to the bank together. Seller can verify with their bank immediately.</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-green-700">Certified cheque</td><td className="py-2 pr-4 text-green-700">Very safe</td><td className="py-2">Similar to bank draft. Call the issuing bank to verify.</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-yellow-700">Interac e-Transfer</td><td className="py-2 pr-4 text-yellow-700">Moderate</td><td className="py-2">OK for deposits. Risky for full payment — hard to reverse.</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-red-700">Cash</td><td className="py-2 pr-4 text-red-700">Risky</td><td className="py-2">No paper trail. Only for small amounts. Never carry large cash.</td></tr>
                    <tr><td className="py-2 pr-4 font-medium text-red-700">Wire transfer</td><td className="py-2 pr-4 text-red-700">Avoid</td><td className="py-2">Irreversible. Common in scams. Never wire money for a vehicle.</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 mt-3">
                <p className="font-medium">Pro tip: Meet at the seller&apos;s bank. Do the money exchange right there. The bank can verify the draft, and both parties have witnesses and security cameras.</p>
              </div>
            </div>
          </section>

          {/* Financing */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" /> Financing Options
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Bank/Credit Union Loan</h3>
                  <p>Usually the best rates. Get pre-approved before you shop so you know your budget. Credit unions often have better rates than big banks.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Dealer Financing</h3>
                  <p>Convenient but rates are often higher. The dealer adds a markup to the lender&apos;s rate. Always compare with your own pre-approval.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Line of Credit</h3>
                  <p>If you have a HELOC or personal LOC, rates may be lower than an auto loan. Flexible repayment but requires discipline.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Avoid: Buy-Here-Pay-Here</h3>
                  <p className="text-red-700">Very high interest rates (often 20%+). Targets buyers with poor credit. You&apos;ll end up paying far more than the car is worth.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <Link href="/guide/inspecting" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Previous: Inspecting
          </Link>
          <Link href="/guide/ownership" className="text-sm text-primary hover:underline flex items-center gap-1">
            Next: After Purchase <ArrowRight className="w-4 h-4" />
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
