export interface ProvinceInfo {
  code: string;
  name: string;
  /** GST rate (federal) */
  gstRate: number;
  /** PST/RST/QST rate (provincial) - 0 if HST province */
  pstRate: number;
  /** HST rate - 0 if separate GST+PST province */
  hstRate: number;
  /** Whether a safety inspection is mandatory for private sales */
  safetyInspectionRequired: boolean;
  /** Typical cost of a safety inspection in CAD */
  safetyInspectionCost?: number;
  /** Lien search registry name */
  lienSearchRegistry: string;
  /** Lien search cost in CAD */
  lienSearchCost?: number;
  /** Days allowed to register after purchase */
  registrationDeadlineDays?: number;
  /** Additional notes */
  notes?: string;
}

export const PROVINCES: Record<string, ProvinceInfo> = {
  ON: {
    code: "ON",
    name: "Ontario",
    gstRate: 0,
    pstRate: 0,
    hstRate: 0.13,
    safetyInspectionRequired: true,
    safetyInspectionCost: 100,
    lienSearchRegistry: "Ontario PPSA",
    lienSearchCost: 8,
    registrationDeadlineDays: 6,
    notes:
      "Safety Standards Certificate required. Dealers must be OMVIC registered. Private sales require UVIP (Used Vehicle Information Package, ~$20).",
  },
  BC: {
    code: "BC",
    name: "British Columbia",
    gstRate: 0.05,
    pstRate: 0.12, // 12% for vehicles up to $55k, higher tiers above
    hstRate: 0,
    safetyInspectionRequired: false,
    lienSearchRegistry: "BC Personal Property Registry",
    lienSearchCost: 11,
    notes:
      "PST is value-based: 12% up to $55k, 15% $55k-$56k, 20% $150k+. Out-of-province vehicles need one-time inspection. New West Partnership exemption for AB/SK/MB vehicles.",
  },
  AB: {
    code: "AB",
    name: "Alberta",
    gstRate: 0.05,
    pstRate: 0,
    hstRate: 0,
    safetyInspectionRequired: false,
    lienSearchRegistry: "Alberta Personal Property Registry",
    lienSearchCost: 10,
    notes:
      "No PST. No mandatory safety inspection for in-province vehicles. Out-of-province vehicles must pass inspection before plates are issued.",
  },
  QC: {
    code: "QC",
    name: "Quebec",
    gstRate: 0.05,
    pstRate: 0.09975,
    hstRate: 0,
    safetyInspectionRequired: false,
    lienSearchRegistry: "RDPRM",
    lienSearchCost: 14,
    registrationDeadlineDays: 30,
    notes:
      "QST applies. Mandatory mechanical inspection for vehicles 8+ years old or with salvage title. SAAQ handles registration.",
  },
  MB: {
    code: "MB",
    name: "Manitoba",
    gstRate: 0.05,
    pstRate: 0.07,
    hstRate: 0,
    safetyInspectionRequired: true,
    safetyInspectionCost: 120,
    lienSearchRegistry: "Manitoba Personal Property Registry",
    notes:
      "RST 7% on purchase price. Safety inspection required for all private sales. MPI handles insurance and registration.",
  },
  SK: {
    code: "SK",
    name: "Saskatchewan",
    gstRate: 0.05,
    pstRate: 0.06,
    hstRate: 0,
    safetyInspectionRequired: false,
    lienSearchRegistry: "Saskatchewan Personal Property Registry",
    notes: "PST 6%. SGI handles registration and insurance.",
  },
  NS: {
    code: "NS",
    name: "Nova Scotia",
    gstRate: 0,
    pstRate: 0,
    hstRate: 0.15,
    safetyInspectionRequired: true,
    safetyInspectionCost: 75,
    lienSearchRegistry: "Nova Scotia Personal Property Registry",
    notes: "HST 15%. Safety inspection valid for 2 years (MVI).",
  },
  NB: {
    code: "NB",
    name: "New Brunswick",
    gstRate: 0,
    pstRate: 0,
    hstRate: 0.15,
    safetyInspectionRequired: true,
    safetyInspectionCost: 75,
    lienSearchRegistry: "New Brunswick Personal Property Registry",
    notes: "HST 15%. Safety inspection required.",
  },
  PE: {
    code: "PE",
    name: "Prince Edward Island",
    gstRate: 0,
    pstRate: 0,
    hstRate: 0.15,
    safetyInspectionRequired: true,
    safetyInspectionCost: 60,
    lienSearchRegistry: "PEI Personal Property Registry",
    notes: "HST 15%.",
  },
  NL: {
    code: "NL",
    name: "Newfoundland and Labrador",
    gstRate: 0,
    pstRate: 0,
    hstRate: 0.15,
    safetyInspectionRequired: true,
    safetyInspectionCost: 75,
    lienSearchRegistry: "NL Personal Property Registry",
    notes: "HST 15%.",
  },
};

/** Calculate total tax rate for a province */
export function getTaxRate(provinceCode: string): number {
  const province = PROVINCES[provinceCode];
  if (!province) return 0;
  return province.hstRate || province.gstRate + province.pstRate;
}

/** Calculate taxes on a vehicle purchase (price in cents, returns cents) */
export function calculateTax(priceCents: number, provinceCode: string): number {
  return Math.round(priceCents * getTaxRate(provinceCode));
}
