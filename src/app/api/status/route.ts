import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Ollama
    const ollamaRes = await fetch("http://localhost:11434/api/tags", { 
      method: "GET",
      timeout: 5000
    }).catch(() => null);
    const ollamaOnline = ollamaRes?.ok ?? false;

    // Check Gateway
    const gatewayRes = await fetch("http://localhost:8765/", { 
      method: "GET",
      timeout: 5000
    }).catch(() => null);
    const gatewayOnline = gatewayRes?.ok ?? false;

    // Check disk space (simplified)
    const diskInfo = "Checking...";

    return NextResponse.json({
      ollama: ollamaOnline,
      gateway: gatewayOnline,
      disk: diskInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch system status:", error);
    return NextResponse.json({ 
      ollama: false, 
      gateway: false, 
      disk: "Unknown",
      error: "Status check failed"
    }, { status: 500 });
  }
}
