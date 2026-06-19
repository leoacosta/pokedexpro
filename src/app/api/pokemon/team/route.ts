import { NextRequest, NextResponse } from "next/server";
import { buildTeamResponse } from "@/lib/pokeapi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const namesParam = searchParams.get("names");

  if (!namesParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: names" },
      { status: 400 }
    );
  }

  const names = namesParam
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return NextResponse.json({ error: "No valid Pokémon names provided" }, { status: 400 });
  }

  if (names.length > 6) {
    return NextResponse.json({ error: "A team can have at most 6 Pokémon" }, { status: 400 });
  }

  try {
    const data = await buildTeamResponse(names);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("Could not find") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
