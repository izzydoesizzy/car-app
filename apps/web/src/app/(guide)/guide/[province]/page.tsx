import Link from "next/link";
import { ArrowLeft, MapPin, DollarSign, Shield, FileText, AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProvinceGuide {
  code: string;
  name: string;
  slug: string;
  taxSummary: string;
  taxDetails: { label: string; rate: string }[];
  privateSaleTax: string;
  dealerSaleTax: string;
  safetyInspection: { required: boolean; details: string; cost?: string };
  registration: { process: string; deadline?: string; cost?: string };
  insurance: { system: string; details: string };
  lienSearch: { registry: string; cost: string; url: string };
  uniqueRules: string[];
  tips: string[];
  watchOuts: string[];
}

const PROVINCE_GUIDES: Record<string, ProvinceGuide> = {
  ontario: {
    code: "ON",
    name: "Ontario",
    slug: "ontario",
    taxSummary: "13% HST on all vehicle purchases (dealer and private)",
    taxDetails: [
      { label: "HST", rate: "13%" },
    ],
    privateSaleTax: "13% HST based on the purchase price or Canadian Red Book wholesale value, whichever is higher. Paid at ServiceOntario when transferring ownership.",
    dealerSaleTax: "13% HST included in the dealer's price or added at point of sale.",
    safetyInspection: {
      required: true,
      details: "A Safety Standards Certificate (SSC) is required to register a used vehicle. The seller can provide one, or the buyer can get one after purchase. The inspection must be done at a licensed Motor Vehicle Inspection Station (MVIS). The certificate is valid for 36 days.",
      cost: "$80-$150",
    },
    registration: {
      process: "Visit ServiceOntario with: signed bill of sale, vehicle permit (ownership), Safety Standards Certificate, UVIP, and valid insurance. Pay HST and registration fees.",
      deadline: "6 days from date of purchase",
      cost: "$32 plate + $59 sticker (varies)",
    },
    insurance: {
      system: "Private insurance companies regulated by FSRA. Shop around for quotes — rates vary significantly between insurers.",
      details: "Must have minimum liability coverage of $200,000 (most carriers require $1M+). Get insurance before picking up the vehicle — you need proof of insurance to register.",
    },
    lienSearch: {
      registry: "Ontario PPSA (Personal Property Security Registration)",
      cost: "$8 per search",
      url: "https://www.ontario.ca/page/search-personal-property-security-registration",
    },
    uniqueRules: [
      "Used Vehicle Information Package (UVIP) is legally required for all private sales — costs $20 from ServiceOntario",
      "UVIP contains registration history, lien information, and fair market value (Canadian Red Book)",
      "Dealers must be registered with OMVIC (Ontario Motor Vehicle Industry Council)",
      "OMVIC provides a 90-day warranty on dealer-sold vehicles under $40,000 and less than 6 years old",
      "Emissions testing (Drive Clean) was eliminated in 2019 — no longer required",
    ],
    tips: [
      "Always request the UVIP before agreeing to a price — it shows what the vehicle is worth and any liens",
      "If buying from a dealer, verify OMVIC registration at omvic.on.ca",
      "Get the safety inspection done at a shop YOU choose, not the seller's preferred mechanic",
      "Budget for winter tires — many insurance companies offer a discount for them",
    ],
    watchOuts: [
      "HST is calculated on the greater of purchase price or Red Book wholesale value — you can't avoid tax by writing a lower price on the bill of sale",
      "Dealers are legally required to disclose accident history — private sellers are not",
      "If the SSC expires (36 days), you need a new inspection",
      "Curbsiders (unlicensed sellers posing as private) are a significant problem — check the UVIP for frequent ownership changes",
    ],
  },
  "british-columbia": {
    code: "BC",
    name: "British Columbia",
    slug: "british-columbia",
    taxSummary: "PST 12-20% (tiered by price) + 5% GST on dealer purchases only",
    taxDetails: [
      { label: "PST (up to $55,000)", rate: "12%" },
      { label: "PST ($55,001-$56,000)", rate: "15%" },
      { label: "PST ($56,001-$149,999)", rate: "20%" },
      { label: "PST ($150,000+)", rate: "20%" },
      { label: "GST (dealer only)", rate: "5%" },
    ],
    privateSaleTax: "PST only (12-20% tiered) on the purchase price or Canadian Black Book wholesale value, whichever is higher. No GST on private sales. Paid at ICBC when transferring.",
    dealerSaleTax: "5% GST + 12-20% PST (tiered). Total 17-25% depending on vehicle value.",
    safetyInspection: {
      required: false,
      details: "No mandatory inspection for in-province vehicles. Out-of-province vehicles must pass a Provincial Inspection at a Designated Inspection Facility (DIF) before registration.",
      cost: "$100-$150 (out-of-province only)",
    },
    registration: {
      process: "Visit an Autoplan broker (ICBC agent). Bring: signed Transfer/Tax Form, proof of insurance, NVIS form (if out of province). ICBC handles registration and insurance together.",
      cost: "~$28 transfer fee + insurance",
    },
    insurance: {
      system: "ICBC is the mandatory basic auto insurer. Optional/extended coverage can be purchased from ICBC or private insurers.",
      details: "Basic Autoplan is mandatory and purchased through Autoplan brokers. You can add optional coverage from ICBC or private companies like BCAA, TD Insurance, etc.",
    },
    lienSearch: {
      registry: "BC Personal Property Registry",
      cost: "$11 per search",
      url: "https://www.bcregistry.gov.bc.ca/ppr",
    },
    uniqueRules: [
      "PST is tiered by purchase price — luxury vehicles (over $55K) pay significantly more",
      "PST is based on the HIGHER of the purchase price or CBB wholesale value",
      "New West Partnership: vehicles from AB, SK, or MB may be exempt from inspection if under 14 years old",
      "ICBC provides free basic vehicle status checks (normal/rebuilt/salvage) online",
      "AirCare emissions testing was eliminated in 2014",
    ],
    tips: [
      "Use ICBC's free online tool to check if a vehicle has been in a crash claim before buying",
      "If buying from Alberta (no PST province), you'll pay BC PST when you register in BC",
      "Get an ICBC vehicle claims history ($20) for any vehicle you're serious about",
      "Shop Autoplan brokers for optional coverage — prices vary for the extended portion",
    ],
    watchOuts: [
      "The tiered PST on expensive vehicles can add thousands — a $60K vehicle pays 20% PST ($12,000) vs 12% ($7,200) for a $55K vehicle",
      "Rebuilt status vehicles have significantly lower resale value and may be harder to insure",
      "Private sellers can do Transfer/Tax Forms online now — make sure you get your copy",
      "Flood damage from atmospheric rivers is a growing concern — check undercarriage carefully",
    ],
  },
  alberta: {
    code: "AB",
    name: "Alberta",
    slug: "alberta",
    taxSummary: "No PST. Only 5% GST on dealer purchases. Private sales are tax-free.",
    taxDetails: [
      { label: "GST (dealer only)", rate: "5%" },
      { label: "PST", rate: "0% (none)" },
    ],
    privateSaleTax: "No tax on private vehicle sales in Alberta. This makes Alberta the cheapest province to buy a used car.",
    dealerSaleTax: "5% GST only. No PST. Significantly cheaper than most other provinces.",
    safetyInspection: {
      required: false,
      details: "No mandatory inspection for in-province vehicles. Out-of-province vehicles require a mechanical fitness inspection before registration.",
      cost: "$100-$200 (out-of-province only)",
    },
    registration: {
      process: "Visit an Alberta Registry Agent. Bring: bill of sale, valid insurance, identification, and out-of-province inspection (if applicable).",
      cost: "~$28 registration + plate fees",
    },
    insurance: {
      system: "Private insurance companies. Rates are regulated by the Alberta Automobile Insurance Rate Board.",
      details: "Mandatory minimum: $200,000 third-party liability. Shop around — Alberta rates have been rising. Consider higher deductibles to lower premiums.",
    },
    lienSearch: {
      registry: "Alberta Personal Property Registry",
      cost: "$10 per search",
      url: "https://www.alberta.ca/personal-property-registry",
    },
    uniqueRules: [
      "No PST — private vehicle sales are completely tax-free",
      "AMVIC (Alberta Motor Vehicle Industry Council) regulates dealers — verify registration",
      "Vehicle is personal property, not registered to the vehicle like in Ontario — ownership follows the person",
      "No mandatory emissions testing",
      "Alberta driver's licenses and registrations do not have photos on the registration document",
    ],
    tips: [
      "Alberta's tax advantage makes it a great place to buy — some buyers travel from BC or SK to purchase here",
      "Even though private sales are tax-free, always get a bill of sale for your records",
      "Check AMVIC's dealer registry before buying from any dealership",
      "Winter tires are strongly recommended (not mandatory) — insurance discounts often available",
    ],
    watchOuts: [
      "No mandatory inspection means you need to be extra diligent about vehicle condition",
      "Hail damage is extremely common in Alberta — check the roof, hood, and trunk carefully",
      "If buying for export to BC, you'll pay BC PST when registering there",
      "Rust from road salt is less common than eastern Canada but still present",
    ],
  },
  quebec: {
    code: "QC",
    name: "Quebec",
    slug: "quebec",
    taxSummary: "5% GST + 9.975% QST on all purchases",
    taxDetails: [
      { label: "GST", rate: "5%" },
      { label: "QST", rate: "9.975%" },
    ],
    privateSaleTax: "QST (9.975%) on the purchase price or estimated value (whichever is higher). GST does not apply to private sales. Tax is paid at SAAQ when transferring.",
    dealerSaleTax: "5% GST + 9.975% QST = 14.975% total. QST is calculated on the price including GST.",
    safetyInspection: {
      required: false,
      details: "Not required for most vehicles. Mandatory mechanical inspection is required for: vehicles 8+ years old being re-registered, salvage/rebuilt titles, and out-of-province vehicles. Done at SAAQ-approved garages.",
      cost: "$100-$175",
    },
    registration: {
      process: "Visit a SAAQ service centre. Bring: signed contract of sale, valid insurance (proof from an authorized Quebec insurer), identification.",
      deadline: "30 days from purchase",
      cost: "$154 registration + $32 plate (approximate)",
    },
    insurance: {
      system: "Two-part system: SAAQ provides mandatory injury coverage (included in registration). Private insurers provide property damage and liability coverage.",
      details: "Bodily injury is covered by SAAQ's public no-fault insurance (included in your registration fees). You must separately purchase property damage/liability from a private insurer.",
    },
    lienSearch: {
      registry: "RDPRM (Registre des droits personnels et r\u00e9els mobiliers)",
      cost: "$14 per search",
      url: "https://www.rdprm.gouv.qc.ca",
    },
    uniqueRules: [
      "SAAQ handles both registration and mandatory injury insurance",
      "French is the official language — all contracts and documents may be in French",
      "Quebec has a no-fault insurance system for bodily injury — you cannot sue for injury damages",
      "Winter tires are MANDATORY from December 1 to March 15 (law)",
      "QST is calculated on the price PLUS GST — so you pay tax on tax",
    ],
    tips: [
      "Winter tires are legally required — budget for them if the vehicle doesn't include a set",
      "Use SAAQ's online services to check vehicle status and history before buying",
      "If you don't speak French, bring someone who does — especially for private sales",
      "Quebec's no-fault system means lower insurance premiums compared to other provinces",
    ],
    watchOuts: [
      "QST is calculated on price + GST, making the effective rate slightly higher than 14.975%",
      "Vehicles from outside Quebec may need a mechanical inspection even if they're relatively new",
      "Road salt usage is heavy — rust is a major concern for Quebec vehicles",
      "Contract of sale must comply with Quebec consumer protection laws — be careful with 'as-is' clauses",
    ],
  },
  manitoba: {
    code: "MB",
    name: "Manitoba",
    slug: "manitoba",
    taxSummary: "5% GST + 7% RST on all purchases",
    taxDetails: [
      { label: "GST", rate: "5%" },
      { label: "RST (Retail Sales Tax)", rate: "7%" },
    ],
    privateSaleTax: "7% RST on the purchase price or Canadian Red Book value (whichever is higher). Paid at MPI when registering. No GST on private sales.",
    dealerSaleTax: "5% GST + 7% RST = 12% total.",
    safetyInspection: {
      required: true,
      details: "A safety inspection certificate is required for all private sales and when a vehicle changes hands (except dealer to consumer in some cases). Must be done at a Manitoba Public Insurance (MPI) approved inspection station.",
      cost: "$100-$150",
    },
    registration: {
      process: "Visit an MPI (Manitoba Public Insurance) service centre or Autopac agent. MPI handles registration, insurance, and driver licensing together.",
      cost: "Registration is bundled with insurance through MPI",
    },
    insurance: {
      system: "MPI (Manitoba Public Insurance) is the sole provider of basic auto insurance. Extended coverage available from MPI only.",
      details: "Manitoba has a public auto insurance monopoly — all vehicle insurance is through MPI (Autopac). No shopping around for basic coverage, but rates are generally competitive.",
    },
    lienSearch: {
      registry: "Manitoba Personal Property Registry",
      cost: "$12 per search",
      url: "https://www.tpg.gov.mb.ca/ppr.html",
    },
    uniqueRules: [
      "MPI is a one-stop shop — registration, insurance, and plates are all handled together",
      "No private insurance competition — MPI (Autopac) is the sole insurer",
      "Safety inspection required on all private sales",
      "Manitoba uses a merit/demerit system through MPI for insurance pricing",
      "RST is called 'Retail Sales Tax' (not PST) in Manitoba",
    ],
    tips: [
      "MPI's public insurance means less hassle — registration and insurance in one visit",
      "Check MPI's online services for vehicle claims history",
      "Budget for the mandatory safety inspection when buying privately",
      "Manitoba winters are harsh — check for rust and ensure the block heater works",
    ],
    watchOuts: [
      "No choice of basic insurer — you're locked into MPI rates",
      "RST is based on the higher of purchase price or book value — similar to Ontario",
      "Extreme cold can reveal hidden mechanical issues — try to test drive in cold weather",
      "Road salt and extreme temperature swings make rust inspection critical",
    ],
  },
  saskatchewan: {
    code: "SK",
    name: "Saskatchewan",
    slug: "saskatchewan",
    taxSummary: "5% GST + 6% PST on all purchases",
    taxDetails: [
      { label: "GST", rate: "5%" },
      { label: "PST", rate: "6%" },
    ],
    privateSaleTax: "6% PST on the purchase price. Paid at SGI when transferring registration. No GST on private sales.",
    dealerSaleTax: "5% GST + 6% PST = 11% total.",
    safetyInspection: {
      required: false,
      details: "No mandatory safety inspection for in-province vehicles. Out-of-province vehicles require an inspection before they can be registered.",
      cost: "$100-$150 (out-of-province only)",
    },
    registration: {
      process: "Visit an SGI (Saskatchewan Government Insurance) motor licence issuer. SGI handles registration and basic insurance together.",
      cost: "Registration bundled with insurance through SGI",
    },
    insurance: {
      system: "SGI provides mandatory basic coverage (no-fault for injury). Optional collision/comprehensive can be purchased from SGI or private insurers.",
      details: "Unique hybrid system: SGI handles mandatory basic coverage, but you can shop around for optional extended coverage from private companies like SGI CANADA, TD, Wawanesa, etc.",
    },
    lienSearch: {
      registry: "Saskatchewan Personal Property Registry",
      cost: "$12 per search",
      url: "https://www.isc.ca/ppr",
    },
    uniqueRules: [
      "SGI handles both mandatory insurance and vehicle registration",
      "Hybrid insurance model — public basic + optional private extended",
      "No mandatory inspection for in-province sales",
      "PST is one of the lowest in Canada at 6%",
      "New West Partnership with AB and MB allows easier cross-provincial vehicle transfers",
    ],
    tips: [
      "Take advantage of SGI's hybrid model — shop around for extended coverage from private insurers",
      "Saskatchewan has relatively low total tax burden compared to eastern provinces",
      "Check SGI's online services for vehicle history and registration status",
      "If buying from Alberta, you'll save on the purchase but pay SK PST when registering",
    ],
    watchOuts: [
      "Extreme temperatures (-40 to +35) take a toll on vehicles — check cooling and heating systems",
      "Gravel roads are common in rural SK — check undercarriage and windshield for rock damage",
      "Hail damage, like Alberta, is a concern in summer months",
      "Limited dealer selection outside Regina and Saskatoon — may need to travel for the best deals",
    ],
  },
  "nova-scotia": {
    code: "NS",
    name: "Nova Scotia",
    slug: "nova-scotia",
    taxSummary: "15% HST on all vehicle purchases",
    taxDetails: [
      { label: "HST", rate: "15%" },
    ],
    privateSaleTax: "15% HST on the purchase price or Canadian Red Book wholesale value, whichever is higher. Paid at Access Nova Scotia when transferring ownership.",
    dealerSaleTax: "15% HST included in the dealer's price or added at point of sale.",
    safetyInspection: {
      required: true,
      details: "A Motor Vehicle Inspection (MVI) is required for all vehicle ownership transfers. The inspection must be done at a licensed inspection station and covers brakes, steering, tires, exhaust, lights, and frame integrity. The MVI sticker is valid for 2 years.",
      cost: "$50-$100",
    },
    registration: {
      process: "Visit Access Nova Scotia. Bring: bill of sale, valid insurance (pink card), MVI certificate, and identification. Vehicle must have a valid MVI before registration.",
      deadline: "Immediately upon purchase (cannot legally drive without registration)",
      cost: "~$168 registration fee",
    },
    insurance: {
      system: "Private insurance companies regulated by the Nova Scotia Utility and Review Board (NSUARB). Rates must be approved by the board.",
      details: "Mandatory minimum: $500,000 third-party liability. Shop around — rates vary but are regulated. Nova Scotia has relatively high insurance rates compared to western Canada.",
    },
    lienSearch: {
      registry: "Nova Scotia Personal Property Registry",
      cost: "$22 per search",
      url: "https://www.novascotia.ca/snsmr/ppr/",
    },
    uniqueRules: [
      "MVI (Motor Vehicle Inspection) is valid for 2 years — check when the current one expires",
      "Nova Scotia has regulated insurance rates — the NSUARB must approve all rate changes",
      "Private sellers are not required to disclose accident history — always get a CARFAX",
      "Vehicles with 'rebuilt' status must pass an enhanced inspection and are branded permanently",
      "Nova Scotia charges one of the highest HST rates in Canada at 15%",
    ],
    tips: [
      "Check the MVI expiry date — if it's expiring soon, factor in the cost of a new inspection",
      "Get multiple insurance quotes — despite regulation, there are meaningful differences between providers",
      "Salt air corrosion is a major issue near the coast — inspect undercarriage and wheel wells thoroughly",
      "Nova Scotia vehicles tend to have more rust than inland provinces — budget for rust remediation",
    ],
    watchOuts: [
      "15% HST is among the highest in Canada — factor this into your total budget",
      "Coastal salt air accelerates rust significantly — even relatively new vehicles can have corrosion issues",
      "Insurance rates in NS are higher than the national average — get a quote before buying",
      "Rebuilt/salvage vehicles are permanently branded on the title — this significantly affects resale value",
    ],
  },
  "new-brunswick": {
    code: "NB",
    name: "New Brunswick",
    slug: "new-brunswick",
    taxSummary: "15% HST on all vehicle purchases",
    taxDetails: [
      { label: "HST", rate: "15%" },
    ],
    privateSaleTax: "15% HST on the purchase price or Canadian Red Book wholesale value, whichever is higher. Paid at Service New Brunswick when transferring.",
    dealerSaleTax: "15% HST included in the dealer's price or added at point of sale.",
    safetyInspection: {
      required: true,
      details: "A mechanical fitness inspection (MFI) is required when ownership changes. Must be completed at a licensed inspection station within 10 days of purchasing the vehicle. Covers safety-critical systems including brakes, steering, lights, tires, and structural integrity.",
      cost: "$50-$100",
    },
    registration: {
      process: "Visit Service New Brunswick. Bring: bill of sale, valid insurance, mechanical fitness inspection certificate, and identification. You must have insurance before registering.",
      deadline: "10 days from purchase",
      cost: "~$150 registration + plate fees",
    },
    insurance: {
      system: "Private insurance companies. New Brunswick has a unique injury compensation system combining tort and no-fault elements.",
      details: "Mandatory minimum: $200,000 third-party liability. New Brunswick reformed its auto insurance system in 2003 — minor injuries have capped payouts. Shop around for the best rates.",
    },
    lienSearch: {
      registry: "New Brunswick Personal Property Registry",
      cost: "$15 per search",
      url: "https://www.pxw1.snb.ca/pls/ppr/ppr_pls.main",
    },
    uniqueRules: [
      "Mechanical fitness inspection must be completed within 10 days of purchase",
      "New Brunswick has a bilingual requirement — service is available in English and French",
      "Dealers must be licensed by Service New Brunswick",
      "No emissions testing program",
      "New Brunswick is a gateway for importing US vehicles — extra scrutiny needed for cross-border vehicles",
    ],
    tips: [
      "Get the inspection done early — the 10-day window goes quickly",
      "If buying from Quebec (nearby), ensure the vehicle has no undisclosed mechanical issues from Quebec's minimal inspection requirements",
      "New Brunswick's proximity to Maine means some vehicles may have US history — always check VIN thoroughly",
      "Compare insurance quotes from multiple providers — rates can vary significantly",
    ],
    watchOuts: [
      "15% HST applies to all purchases — one of the highest tax rates in Canada",
      "Road salt usage is heavy throughout the province — rust inspection is critical",
      "Watch for vehicles imported from the US through Maine — they may not meet Canadian safety standards",
      "Limited dealer inventory outside Moncton, Saint John, and Fredericton — may need to travel",
    ],
  },
  "prince-edward-island": {
    code: "PE",
    name: "Prince Edward Island",
    slug: "prince-edward-island",
    taxSummary: "15% HST on all vehicle purchases",
    taxDetails: [
      { label: "HST", rate: "15%" },
    ],
    privateSaleTax: "15% HST on the purchase price or the average wholesale price, whichever is higher. Paid at Access PEI when registering.",
    dealerSaleTax: "15% HST included in or added to the dealer's sale price.",
    safetyInspection: {
      required: true,
      details: "A motor vehicle inspection is required for all ownership transfers. Must be done at a licensed inspection station. Covers brakes, tires, lights, steering, exhaust, frame, and glass. Certificate must be presented at registration.",
      cost: "$40-$80",
    },
    registration: {
      process: "Visit Access PEI. Bring: bill of sale, proof of valid insurance, motor vehicle inspection certificate, and identification.",
      cost: "~$100 registration fee",
    },
    insurance: {
      system: "Private insurance companies. PEI has a relatively small market with fewer insurers than larger provinces.",
      details: "Mandatory minimum: $200,000 third-party liability. With fewer providers, shopping around is still important but options are more limited than in Ontario or Alberta.",
    },
    lienSearch: {
      registry: "PEI Personal Property Registry",
      cost: "$15 per search",
      url: "https://www.princeedwardisland.ca/en/service/personal-property-registry-search",
    },
    uniqueRules: [
      "Small market means limited vehicle selection — many buyers travel to Nova Scotia or New Brunswick",
      "Motor vehicle inspection required before registration",
      "PEI has no interprovincial inspection exemptions — all out-of-province vehicles need inspection",
      "No emissions testing program on PEI",
      "PEI's small size means most vehicles stay local — check for island-specific corrosion from coastal salt",
    ],
    tips: [
      "Consider buying from Nova Scotia or New Brunswick for more selection — just factor in the travel and HST",
      "PEI's small market means word-of-mouth matters — ask locals about the seller's reputation",
      "Inspection costs are generally lower than larger provinces — take advantage",
      "Island vehicles are often lower mileage due to PEI's small size, but may have more salt corrosion",
    ],
    watchOuts: [
      "15% HST — same as all Atlantic provinces, among the highest in Canada",
      "Very limited dealer inventory — you may need to look off-island for specific makes/models",
      "Island salt air plus road salt creates a double rust risk — inspect carefully",
      "Fewer insurance options can mean less competitive rates — get quotes early",
    ],
  },
  "newfoundland-and-labrador": {
    code: "NL",
    name: "Newfoundland and Labrador",
    slug: "newfoundland-and-labrador",
    taxSummary: "15% HST on all vehicle purchases",
    taxDetails: [
      { label: "HST", rate: "15%" },
    ],
    privateSaleTax: "15% HST on the purchase price or the wholesale value, whichever is higher. Paid at Motor Registration Division (MRD) when transferring ownership.",
    dealerSaleTax: "15% HST included in the dealer's sale price.",
    safetyInspection: {
      required: true,
      details: "A motor vehicle inspection is required for all ownership changes. Must be completed at a licensed inspection station. NL has a particularly rigorous inspection given the province's harsh weather conditions. Certificate required for registration.",
      cost: "$75-$125",
    },
    registration: {
      process: "Visit Service NL Motor Registration Division (MRD). Bring: bill of sale, valid insurance, motor vehicle inspection certificate, and identification.",
      cost: "~$180 registration fee",
    },
    insurance: {
      system: "Private insurance companies. Newfoundland has some of the highest auto insurance rates in Canada due to geography and claim frequency.",
      details: "Mandatory minimum: $200,000 third-party liability. NL typically has the highest or second-highest insurance rates in Canada — get quotes before committing to a purchase.",
    },
    lienSearch: {
      registry: "NL Personal Property Security Registry",
      cost: "$20 per search",
      url: "https://www.gov.nl.ca/dgsnl/registries/ppsr/",
    },
    uniqueRules: [
      "NL has some of the highest auto insurance rates in Canada — budget accordingly",
      "Rigorous vehicle inspection due to harsh weather and road conditions",
      "Many vehicles are shipped by ferry to/from the island — adds transportation costs for off-island purchases",
      "Service NL's Motor Registration Division handles all vehicle registrations",
      "NL uses road salt extensively and has harsh marine conditions — double rust risk",
    ],
    tips: [
      "Get insurance quotes BEFORE buying — NL rates can be shockingly high for some vehicle types",
      "Factor in ferry costs if buying from Nova Scotia or elsewhere on the mainland",
      "Block heaters are essential — ensure one is installed and working",
      "Consider the total cost of ownership including NL's higher gas prices and insurance rates",
    ],
    watchOuts: [
      "Insurance rates are among the highest in Canada — this is a major ongoing cost",
      "15% HST plus high registration fees make the upfront cost significant",
      "Severe weather (salt, moisture, freeze-thaw cycles) means rust is a primary concern",
      "Limited selection — many NL buyers travel to Nova Scotia or order vehicles to be shipped by ferry",
    ],
  },
};

function getGuideBySlug(slug: string): ProvinceGuide | undefined {
  return PROVINCE_GUIDES[slug];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>;
}): Promise<Metadata> {
  const { province } = await params;
  const guide = getGuideBySlug(province);
  if (!guide) return { title: "Province Not Found" };
  return {
    title: `Buying a Used Car in ${guide.name} — CarScout Guide`,
    description: `Everything you need to know about buying a used car in ${guide.name}. Taxes, inspections, registration, insurance, and province-specific tips.`,
  };
}

export default async function ProvinceGuidePage({
  params,
}: {
  params: Promise<{ province: string }>;
}) {
  const { province } = await params;
  const guide = getGuideBySlug(province);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            CarScout
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/guide" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Guide
            </Link>
            <Link href="/auth/signup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All Province Guides
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Buying a Used Car in {guide.name}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{guide.taxSummary}</p>

        <div className="space-y-8">
          {/* Taxes */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" /> Taxes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {guide.taxDetails.map((tax) => (
                <div key={tax.label} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{tax.label}</p>
                  <p className="text-xl font-bold text-primary">{tax.rate}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-medium mb-1">Private Sale</h3>
                <p className="text-muted-foreground">{guide.privateSaleTax}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Dealer Purchase</h3>
                <p className="text-muted-foreground">{guide.dealerSaleTax}</p>
              </div>
            </div>
          </section>

          {/* Safety Inspection */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" /> Safety Inspection
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${guide.safetyInspection.required ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                {guide.safetyInspection.required ? "Required" : "Not Required"}
              </span>
              {guide.safetyInspection.cost && (
                <span className="text-sm text-muted-foreground">
                  Typical cost: {guide.safetyInspection.cost}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{guide.safetyInspection.details}</p>
          </section>

          {/* Registration */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" /> Registration
            </h2>
            <p className="text-sm text-muted-foreground mb-2">{guide.registration.process}</p>
            {guide.registration.deadline && (
              <p className="text-sm font-medium">
                Deadline: {guide.registration.deadline}
              </p>
            )}
            {guide.registration.cost && (
              <p className="text-sm text-muted-foreground mt-1">
                Cost: {guide.registration.cost}
              </p>
            )}
          </section>

          {/* Insurance */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Insurance</h2>
            <p className="text-sm font-medium mb-1">{guide.insurance.system}</p>
            <p className="text-sm text-muted-foreground">{guide.insurance.details}</p>
          </section>

          {/* Lien Search */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Lien Search</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Registry:</span> {guide.lienSearch.registry}</p>
              <p><span className="text-muted-foreground">Cost:</span> {guide.lienSearch.cost}</p>
              <a
                href={guide.lienSearch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-block mt-1"
              >
                Search online &rarr;
              </a>
            </div>
          </section>

          {/* Unique Rules */}
          <section className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">{guide.name}-Specific Rules</h2>
            <ul className="space-y-2">
              {guide.uniqueRules.map((rule, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">&#x2022;</span>
                  <span className="text-muted-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tips */}
          <section className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Tips for Buyers in {guide.name}</h2>
            <ul className="space-y-2">
              {guide.tips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-1">&#x2713;</span>
                  <span className="text-green-800">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Watch Outs */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" /> Watch Out
            </h2>
            <ul className="space-y-2">
              {guide.watchOuts.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">!</span>
                  <span className="text-yellow-800">{item}</span>
                </li>
              ))}
            </ul>
          </section>
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

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CarScout. Built for Canadian car buyers.
        </div>
      </footer>
    </div>
  );
}
