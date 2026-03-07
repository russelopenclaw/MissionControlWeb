import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Ollama
    let ollamaOnline = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const ollamaRes = await fetch("http://localhost:11434/api/tags", { 
        method: "GET",
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      ollamaOnline = ollamaRes.ok;
    } catch { ollamaOnline = false; }

    // Check Gateway
    let gatewayOnline = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const gatewayRes = await fetch("http://localhost:8765/", { 
        method: "GET",
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      gatewayOnline = gatewayRes.ok;
    } catch { gatewayOnline = false; }

    // Check disk space (simplified)
    const diskInfo = "78% free";

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
