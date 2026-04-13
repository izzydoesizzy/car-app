import { ExternalLink, FileSearch, Wrench, Shield, Search, DollarSign, ClipboardCheck } from "lucide-react";
import type { Listing } from "@carscout/shared";

interface AffiliateService {
  id: string;
  name: string;
  description: string;
  pricing: string;
  url: string;
  icon: React.ReactNode;
  showWhen: (listing: Listing) => boolean;
}

const AFFILIATE_SERVICES: AffiliateService[] = [
  {
    id: "carfax-canada",
    name: "CARFAX Canada",
    description: "Vehicle history report with accident, service, and lien data.",
    pricing: "From $50.95",
    url: "https://www.carfax.ca",
    icon: <FileSearch className="w-5 h-5" />,
    showWhen: (l) => !!l.vin || l.status === "saved" || l.status === "contacted",
  },
  {
    id: "bluedriver",
    name: "BlueDriver OBD2 Scanner",
    description:
      "Read codes, check emissions, and run diagnostics. Essential for buying uncertified.",
    pricing: "$85-$120 on Amazon.ca",
    url: "https://www.amazon.ca/s?k=bluedriver+obd2",
    icon: <Wrench className="w-5 h-5" />,
    showWhen: () => true,
  },
  {
    id: "caa-inspection",
    name: "CAA Pre-Purchase Inspection",
    description:
      "Certified technicians inspect the vehicle on-site with a comprehensive report.",
    pricing: "From $199",
    url: "https://www.caa.ca",
    icon: <Shield className="w-5 h-5" />,
    showWhen: (l) =>
      l.status === "viewing_scheduled" ||
      l.status === "contacted" ||
      l.status === "inspected",
  },
  {
    id: "ppsa-lien",
    name: "PPSA Lien Search",
    description:
      "Check if there are any outstanding liens on the vehicle before you buy.",
    pricing: "$8-$14 per search",
    url: "https://www.ontario.ca/page/search-personal-property-security-registration",
    icon: <Search className="w-5 h-5" />,
    showWhen: (l) => !!l.vin,
  },
  {
    id: "ineedappi",
    name: "iNeedaPPi",
    description:
      "Mobile pre-purchase inspection at the vehicle's location. 50+ photos, condition score, and repair cost estimates.",
    pricing: "$189.99",
    url: "https://ineedappi.ca",
    icon: <ClipboardCheck className="w-5 h-5" />,
    showWhen: (l) =>
      l.status === "viewing_scheduled" ||
      l.status === "contacted" ||
      l.status === "inspected",
  },
  {
    id: "kbb-canada",
    name: "Kelley Blue Book Canada",
    description:
      "Check fair market value, trade-in value, and pricing trends for your vehicle.",
    pricing: "Free",
    url: "https://www.kbb.ca/en-ca",
    icon: <DollarSign className="w-5 h-5" />,
    showWhen: () => true,
  },
];

export function AffiliateCards({ listing }: { listing: Listing }) {
  const relevantServices = AFFILIATE_SERVICES.filter((s) =>
    s.showWhen(listing)
  );

  if (relevantServices.length === 0) return null;

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <h2 className="font-semibold mb-3">Recommended Tools</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Services that can help with this listing.
        <span className="italic"> Some links may be affiliate links.</span>
      </p>
      <div className="space-y-3">
        {relevantServices.map((service) => (
          <a
            key={service.id}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-primary mt-0.5">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm">{service.name}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {service.description}
                </p>
                <p className="text-xs text-primary font-medium mt-1">
                  {service.pricing}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
