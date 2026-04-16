import { NextResponse } from "next/server"

/** Simple server time endpoint for clock sync. */
export async function GET() {
  return NextResponse.json({ serverTime: new Date().toISOString() })
}
