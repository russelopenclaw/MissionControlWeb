import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM subagents ORDER BY started_at DESC LIMIT 20"
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch subagents:", error);
    return NextResponse.json({ error: "Failed to fetch subagents" }, { status: 500 });
  }
}
