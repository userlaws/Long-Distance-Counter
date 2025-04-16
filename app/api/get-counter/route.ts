import { NextResponse } from "next/server"

// In-memory counter for demo purposes
// In a production app, you would use a database
const counter = 0

export async function GET() {
  return NextResponse.json({ count: counter })
}
