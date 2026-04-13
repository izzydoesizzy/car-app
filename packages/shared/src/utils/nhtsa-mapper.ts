export interface NhtsaResult {
  Variable: string;
  Value: string | null;
  VariableId: number;
}

export interface DecodedVehicle {
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  bodyType: string | null;
  drivetrain: string | null;
  fuelType: string | null;
  transmission: string | null;
  engine: string | null;
  plantCountry: string | null;
}

const FIELD_MAP: Record<string, keyof DecodedVehicle> = {
  Make: "make",
  Model: "model",
  "Model Year": "year",
  Trim: "trim",
  "Body Class": "bodyType",
  "Drive Type": "drivetrain",
  "Fuel Type - Primary": "fuelType",
  "Transmission Style": "transmission",
  "Plant Country": "plantCountry",
};

/**
 * Map an NHTSA vPIC DecodeVin response to CarScout vehicle fields.
 */
export function mapNhtsaResponse(results: NhtsaResult[]): DecodedVehicle {
  const decoded: DecodedVehicle = {
    year: null,
    make: null,
    model: null,
    trim: null,
    bodyType: null,
    drivetrain: null,
    fuelType: null,
    transmission: null,
    engine: null,
    plantCountry: null,
  };

  let cylinders: string | null = null;
  let displacement: string | null = null;

  for (const { Variable, Value } of results) {
    if (!Value || Value.trim() === "") continue;

    const field = FIELD_MAP[Variable];
    if (field) {
      if (field === "year") {
        decoded.year = parseInt(Value, 10) || null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (decoded as any)[field] = Value.trim();
      }
    }

    if (Variable === "Engine Number of Cylinders") {
      cylinders = Value.trim();
    }
    if (Variable === "Displacement (L)") {
      displacement = parseFloat(Value).toFixed(1);
    }
  }

  // Build engine string like "2.0L 4-Cylinder"
  if (displacement || cylinders) {
    const parts: string[] = [];
    if (displacement) parts.push(`${displacement}L`);
    if (cylinders) parts.push(`${cylinders}-Cylinder`);
    decoded.engine = parts.join(" ");
  }

  return decoded;
}

/**
 * Check if the odometer reading is suspiciously low for the vehicle age.
 * Canadian average is ~20,000 km/year.
 */
export function isOdometerSuspicious(
  year: number | undefined | null,
  mileageKm: number | undefined | null
): { suspicious: boolean; message: string | null } {
  if (!year || !mileageKm) return { suspicious: false, message: null };
  const age = new Date().getFullYear() - year;
  if (age <= 1) return { suspicious: false, message: null };

  const avgKmPerYear = 20000;
  const expectedMin = age * avgKmPerYear * 0.3; // 30% of average
  const actualPerYear = Math.round(mileageKm / age);

  if (mileageKm < expectedMin) {
    return {
      suspicious: true,
      message: `Unusually low mileage for a ${age}-year-old vehicle (${mileageKm.toLocaleString()} km = ~${actualPerYear.toLocaleString()} km/year vs Canadian average of ~20,000 km/year). This could indicate odometer tampering.`,
    };
  }

  return { suspicious: false, message: null };
}
