const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const VIN_TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

/**
 * Validate a VIN using the ISO 3779 check digit algorithm.
 * Returns true if the VIN format is valid.
 */
export function isValidVin(vin: string): boolean {
  if (!vin) return false;
  const upper = vin.toUpperCase().trim();
  if (!VIN_REGEX.test(upper)) return false;

  // Check digit validation (position 9)
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = upper[i];
    const value = VIN_TRANSLITERATION[char] ?? parseInt(char, 10);
    sum += value * VIN_WEIGHTS[i];
  }
  const remainder = sum % 11;
  const checkDigit = remainder === 10 ? "X" : String(remainder);
  return upper[8] === checkDigit;
}

/**
 * Extract the model year from a VIN (position 10).
 * Returns undefined if the VIN is invalid.
 */
export function getYearFromVin(vin: string): number | undefined {
  if (!vin || vin.length < 10) return undefined;
  const yearChar = vin.toUpperCase()[9];
  const yearMap: Record<string, number> = {
    A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015,
    G: 2016, H: 2017, J: 2018, K: 2019, L: 2020, M: 2021,
    N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, V: 2027,
    W: 2028, X: 2029, Y: 2030,
    "1": 2001, "2": 2002, "3": 2003, "4": 2004, "5": 2005,
    "6": 2006, "7": 2007, "8": 2008, "9": 2009,
  };
  return yearMap[yearChar];
}
