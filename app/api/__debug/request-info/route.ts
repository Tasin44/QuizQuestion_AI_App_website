import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const headers = {} as Record<string, string>;
  for (const [k, v] of req.headers) {
    headers[k] = v;
  }

  const cookieHeader = req.headers.get('cookie') || '';
  const cookieNames = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((c) => c.split('=')[0]);

  // Return only header names and cookie names — do NOT return cookie values.
  const headerNames = Object.keys(headers);

  return NextResponse.json({
    path: new URL(req.url).pathname,
    headerNames,
    cookieNames,
    // include user agent and host for convenience
    userAgent: req.headers.get('user-agent') || null,
    host: req.headers.get('host') || null,
  });
}
