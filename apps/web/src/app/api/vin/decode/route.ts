import { NextResponse } from "next/server";
import { isValidVin, mapNhtsaResponse } from "@carscout/shared";
import type { NhtsaResult } from "@carscout/shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vin = searchParams.get("vin")?.toUpperCase().trim();

  if (!vin) {
    return NextResponse.json({ error: "vin parameter is required" }, { status: 400 });
  }

  if (!isValidVin(vin)) {
    return NextResponse.json({ error: "Invalid VIN format" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "NHTSA API unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results: NhtsaResult[] = data.Results ?? [];

    // Check for decode errors from NHTSA
    const errorCode = results.find((r) => r.Variable === "Error Code");
    if (errorCode?.Value && !errorCode.Value.startsWith("0")) {
      const errorText = results.find((r) => r.Variable === "Error Text");
      return NextResponse.json({
        decoded: null,
        error: errorText?.Value ?? "VIN could not be decoded",
      });
    }

    const decoded = mapNhtsaResponse(results);
    return NextResponse.json({ decoded });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach NHTSA API" },
      { status: 502 }
    );
  }
}
