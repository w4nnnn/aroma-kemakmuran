import { NextRequest, NextResponse } from "next/server";

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  
  if (path[0] === 'logout') {
    const res = NextResponse.json({ success: true });
    res.cookies.delete('pb_auth');
    return res;
  }

  const pbUrl = process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090';
  
  // Construct the target URL
  const targetPath = path.join("/");
  const url = new URL(request.url);
  const targetUrl = new URL(`/api/${targetPath}${url.search}`, pbUrl);

  // Forward headers (especially auth and content-type)
  const headers = new Headers();
  
  // Transfer auth cookie to Authorization header if present
  const pbAuth = request.cookies.get('pb_auth');
  if (pbAuth) {
    try {
      const parsed = JSON.parse(pbAuth.value);
      if (parsed.token) {
        headers.set('Authorization', `Bearer ${parsed.token}`);
      }
    } catch(e) {}
  }

  if (request.headers.get('content-type')) {
    headers.set('Content-Type', request.headers.get('content-type')!);
  }

  // Handle body
  let body: any = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    // Check if it's multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
      // Remove content-type so fetch generates the correct boundary automatically
      headers.delete('Content-Type');
    } else {
      body = await request.text();
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
      // allow fetching self-signed if internal
      duplex: body instanceof ReadableStream ? "half" : undefined,
    } as RequestInit);

    // If it's a login request (auth-with-password), we need to capture the token
    // and set it as an HTTP-only cookie on the Next.js side.
    const isLogin = targetPath.includes("auth-with-password");
    let responseData;
    let resOptions: ResponseInit = {
      status: response.status,
      headers: new Headers(response.headers),
    };

    if (isLogin && response.ok) {
      responseData = await response.json();
      const nextRes = NextResponse.json(responseData, resOptions);
      nextRes.cookies.set('pb_auth', JSON.stringify({ token: responseData.token, model: responseData.record }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return nextRes;
    }

    // For normal responses
    const arrayBuffer = await response.arrayBuffer();
    const nextRes = new NextResponse(arrayBuffer, resOptions);
    return nextRes;
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
