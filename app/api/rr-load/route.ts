import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "pt";
  const target = `https://my.raceresult.com/RRPublish/load.js.php?lang=${encodeURIComponent(lang)}`;

  const upstream = await fetch(target, {
    cache: "force-cache",
    next: { revalidate: 300 },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Falha a obter script RaceResult" },
      { status: upstream.status },
    );
  }

  const body = await upstream.text();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
    },
  });
}
