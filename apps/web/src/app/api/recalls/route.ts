import { NextResponse } from "next/server";

export interface RecallItem {
  recallNumber: string;
  date: string;
  systemType: string;
  summary: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  if (!make || !model || !year) {
    return NextResponse.json(
      { error: "make, model, and year are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TRANSPORT_CANADA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Transport Canada API key not configured",
        hint: "Register at https://tc.api.canada.ca and add TRANSPORT_CANADA_API_KEY to .env.local",
      },
      { status: 503 }
    );
  }

  try {
    const url = `https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall/make-name/${encodeURIComponent(make)}/model-name/${encodeURIComponent(model)}/year-range/${year}-${year}`;

    const res = await fetch(url, {
      headers: { "user-key": apiKey },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Transport Canada API error" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results = data.ResultSet ?? [];

    const recalls: RecallItem[] = results.map(
      (r: Record<string, string>) => ({
        recallNumber: r.RECALL_NUMBER_NUM ?? r.Recall_Number_Num ?? "",
        date: r.RECALL_DATE_DTE ?? r.Recall_Date_Dte ?? "",
        systemType: r.SYSTEM_TYPE_ETXT ?? r.System_Type_Etxt ?? "",
        summary: r.NOTIFICATION_TYPE_ETXT ?? r.Notification_Type_Etxt ?? "",
      })
    );

    return NextResponse.json({ recalls, count: recalls.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach Transport Canada API" },
      { status: 502 }
    );
  }
}
