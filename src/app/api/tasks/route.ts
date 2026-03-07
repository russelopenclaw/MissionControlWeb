import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    const inProgress = await client.query(
      "SELECT id, title, column_name, assignee, priority FROM tasks WHERE column_name = 'in-progress' ORDER BY priority DESC, created_at ASC"
    );
    
    const backlog = await client.query(
      "SELECT id, title, column_name, assignee, priority FROM tasks WHERE column_name = 'backlog' ORDER BY priority DESC, created_at ASC"
    );
    
    const done = await client.query(
      "SELECT id, title, column_name, assignee, priority FROM tasks WHERE column_name IN ('done', 'complete') ORDER BY updated_at DESC LIMIT 10"
    );
    
    client.release();

    return NextResponse.json({
      inProgress: inProgress.rows,
      backlog: backlog.rows,
      done: done.rows,
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
