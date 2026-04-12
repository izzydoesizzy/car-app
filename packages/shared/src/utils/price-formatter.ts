/**
 * Format a price in cents to a display string.
 * @example formatPrice(2599900) => "$25,999"
 * @example formatPrice(2599900, { showCents: true }) => "$25,999.00"
 */
export function formatPrice(
  cents: number | undefined | null,
  options?: { showCents?: boolean }
): string {
  if (cents == null) return "—";
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: options?.showCents ? 2 : 0,
    maximumFractionDigits: options?.showCents ? 2 : 0,
  }).format(dollars);
}

/**
 * Parse a price string to cents.
 * Handles: "$25,999", "$25999.00", "25999", "25,999.99"
 */
export function parsePriceToCents(priceStr: string): number | undefined {
  if (!priceStr) return undefined;
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return undefined;
  // If the original string has a decimal, treat as dollars
  if (cleaned.includes(".")) {
    return Math.round(parsed * 100);
  }
  // Otherwise, assume it's already in dollars (no cents)
  return parsed * 100;
}

/**
 * Format mileage with "km" suffix.
 * @example formatMileage(85000) => "85,000 km"
 */
export function formatMileage(km: number | undefined | null): string {
  if (km == null) return "—";
  return `${new Intl.NumberFormat("en-CA").format(km)} km`;
}
