import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// SSRF 방지: 허용된 샤오홍슈 CDN 호스트만 다운로드 허용
const ALLOWED_HOST_SUFFIXES = ['xhscdn.com', 'xiaohongshu.com'];

function isAllowed(target: string): boolean {
  try {
    const u = new URL(target);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => u.hostname === suffix || u.hostname.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

async function fetchMedia(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        Referer: 'https://www.xiaohongshu.com/',
      },
    });
    if (!res.ok || !res.body) return null;
    return res;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');
  const fallback = searchParams.get('fallback');
  const filename = (searchParams.get('filename') || 'xiaohongshu').replace(/[^\w.\-가-힣]/g, '_');

  if (!target || !isAllowed(target)) {
    return NextResponse.json({ error: '허용되지 않은 URL입니다.' }, { status: 400 });
  }

  let upstream = await fetchMedia(target);
  if (!upstream && fallback && isAllowed(fallback)) {
    upstream = await fetchMedia(fallback);
  }

  if (!upstream) {
    return NextResponse.json({ error: '미디어를 불러오지 못했습니다.' }, { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const contentLength = upstream.headers.get('content-length');

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'Cache-Control': 'no-store',
  };
  if (contentLength) headers['Content-Length'] = contentLength;

  return new NextResponse(upstream.body, { headers });
}
