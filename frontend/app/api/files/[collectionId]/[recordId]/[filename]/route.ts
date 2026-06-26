import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string; recordId: string; filename: string }> }
) {
  const { collectionId, recordId, filename } = await params;
  const pbUrl = process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090';
  const targetUrl = `${pbUrl}/api/files/${collectionId}/${recordId}/${filename}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse("File not found", { status: response.status });
    }

    const contentType = response.headers.get("content-type");
    
    // Create a new response with the stream
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
