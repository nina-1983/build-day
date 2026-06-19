import { NextResponse } from "next/server";
import { notion, DB_ID, title, rich, email, dateProp, checkbox } from "@/lib/notion";

const ALLOWED_ORIGINS = [
  "https://nina-mistry.com",
  "https://www.nina-mistry.com",
  "https://nina-build-day-checklist.vercel.app",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[2];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";

  try {
    if (!process.env.NOTION_TOKEN || !DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const body = await request.json();

    const properties = {
      "Client Name": title(body.name || "Untitled"),
      "Email": email(body.email || ""),
      "Build Day Date": dateProp(body.buildDate || null),
      "Landing page copy": checkbox(body.landingCopy),
      "Thank you page copy": checkbox(body.thankYouCopy),
      "Email sequence copy": checkbox(body.emailCopy),
      "Brand images": checkbox(body.brandImages),
      "Logo file": checkbox(body.logo),
      "Brand colours & fonts": checkbox(body.brandColours),
      "Payment link": checkbox(body.paymentLink),
      "Redirect URLs": checkbox(body.redirectUrls),
      "Platform login details": checkbox(body.platformLogin),
      "Notes": rich(body.notes || ""),
      "Date Submitted": dateProp(body.submittedAt || null),
    };

    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
    });

    return NextResponse.json(
      { ok: true, id: page.id },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
