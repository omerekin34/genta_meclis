import { NextResponse } from "next/server";
import { lookupApplicationStatus } from "@/lib/applications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kod = new URL(request.url).searchParams.get("kod")?.trim() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(kod)) {
    return NextResponse.json({ error: "Takip numarasını eksiksiz yazın." }, { status: 400 });
  }
  const found = await lookupApplicationStatus(kod);
  if ("error" in found) {
    return NextResponse.json({ error: found.error }, { status: found.error.includes("bulunamadı") ? 404 : 503 });
  }
  return NextResponse.json(found);
}
