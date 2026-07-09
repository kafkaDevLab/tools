import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

interface MediaImage {
  url: string; // 워터마크 제거 우선 URL
  fallback: string; // 원본 URL (프록시 재시도용)
}

interface ParseResult {
  type: 'image' | 'video';
  title: string;
  desc: string;
  cover: string | null;
  images: MediaImage[];
  video: { url: string; fallback: string | null } | null;
}

/** 공유 텍스트/문장에서 첫 번째 URL을 추출 */
function extractUrl(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s'"<>）)]+/i);
  return match ? match[0] : null;
}

/** 짧은 링크(xhslink.com 등)를 실제 노트 URL로 리다이렉트 추적 */
async function resolveUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    return res.url || url;
  } catch {
    return url;
  }
}

/** __INITIAL_STATE__ JSON 블록을 HTML에서 추출 */
function extractInitialState(html: string): any | null {
  const marker = 'window.__INITIAL_STATE__=';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;

  let start = idx + marker.length;
  // 이어지는 </script> 전까지 잘라내기
  const end = html.indexOf('</script>', start);
  let raw = end === -1 ? html.slice(start) : html.slice(start, end);
  raw = raw.trim();
  if (raw.endsWith(';')) raw = raw.slice(0, -1);

  // 샤오홍슈는 JSON에 undefined 리터럴을 넣어 표준 JSON 파싱을 깨뜨림 → null 로 치환
  const cleaned = raw.replace(/:\s*undefined/g, ':null').replace(/\bundefined\b/g, 'null');

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/** urlDefault 로부터 워터마크 없는 원본 이미지 URL 생성 */
function toNoWatermark(urlDefault: string): string {
  try {
    const base = urlDefault.split('!')[0].split('?')[0];
    const token = base.substring(base.lastIndexOf('/') + 1);
    if (token && /^[0-9a-z]+$/i.test(token)) {
      return `https://ci.xiaohongshu.com/${token}?imageView2/format/png`;
    }
  } catch {
    /* ignore */
  }
  return urlDefault;
}

/** __INITIAL_STATE__ 구조에서 노트 데이터 파싱 */
function parseFromState(state: any): ParseResult | null {
  const noteRoot = state?.note;
  if (!noteRoot) return null;

  const map = noteRoot.noteDetailMap || {};
  const firstId = noteRoot.firstNoteId || Object.keys(map)[0];
  const detail = map[firstId];
  const note = detail?.note;
  if (!note) return null;

  const title: string = note.title || '';
  const desc: string = note.desc || '';

  // 이미지 목록
  const images: MediaImage[] = Array.isArray(note.imageList)
    ? note.imageList
        .map((img: any) => {
          const urlDefault: string =
            img.urlDefault ||
            img.urlPre ||
            (Array.isArray(img.infoList) && img.infoList.length
              ? img.infoList[img.infoList.length - 1].url
              : '');
          if (!urlDefault) return null;
          return { url: toNoWatermark(urlDefault), fallback: urlDefault };
        })
        .filter(Boolean)
    : [];

  // 동영상
  let video: ParseResult['video'] = null;
  const stream = note.video?.media?.stream;
  if (stream) {
    const codecs = [stream.h264, stream.h265, stream.av1].filter(Array.isArray);
    for (const arr of codecs) {
      if (arr.length && arr[0]?.masterUrl) {
        video = { url: arr[0].masterUrl, fallback: null };
        break;
      }
    }
  }
  if (!video && note.video?.consumer?.originVideoKey) {
    video = {
      url: `https://sns-video-bd.xhscdn.com/${note.video.consumer.originVideoKey}`,
      fallback: null,
    };
  }

  const type: 'image' | 'video' = video ? 'video' : 'image';
  const cover = video ? images[0]?.fallback || null : images[0]?.fallback || null;

  if (!images.length && !video) return null;

  return { type, title, desc, cover, images, video };
}

/** meta 태그 기반 폴백 파서 */
function parseFromMeta(html: string): ParseResult | null {
  const metas: Record<string, string> = {};
  const re = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']*)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    metas[m[1]] = m[2];
  }

  const title = metas['og:title'] || metas['twitter:title'] || '';
  const desc = metas['og:description'] || metas['description'] || '';
  const videoUrl = metas['og:video'] || metas['og:video:url'] || '';

  const images: MediaImage[] = [];
  const imgRe = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
  while ((m = imgRe.exec(html)) !== null) {
    images.push({ url: m[1], fallback: m[1] });
  }

  if (videoUrl) {
    return {
      type: 'video',
      title,
      desc,
      cover: images[0]?.url || null,
      images,
      video: { url: videoUrl, fallback: null },
    };
  }
  if (images.length) {
    return { type: 'image', title, desc, cover: images[0].url, images, video: null };
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawInput: string = (body?.url || '').toString().trim();

    if (!rawInput) {
      return NextResponse.json({ error: '링크를 입력해주세요.' }, { status: 400 });
    }

    const url = extractUrl(rawInput);
    if (!url) {
      return NextResponse.json({ error: '유효한 링크를 찾을 수 없습니다.' }, { status: 400 });
    }

    if (!/xiaohongshu\.com|xhslink\.com|xhscdn\.com/i.test(url)) {
      return NextResponse.json(
        { error: '샤오홍슈(小红书) 링크만 지원합니다.' },
        { status: 400 }
      );
    }

    const finalUrl = await resolveUrl(url);

    const res = await fetch(finalUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: 'https://www.xiaohongshu.com/',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `노트 페이지를 불러오지 못했습니다. (HTTP ${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();

    const state = extractInitialState(html);
    let result = state ? parseFromState(state) : null;
    if (!result) result = parseFromMeta(html);

    if (!result) {
      return NextResponse.json(
        {
          error:
            '미디어를 추출하지 못했습니다. 링크가 만료되었거나 로그인이 필요한 콘텐츠일 수 있습니다.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Xiaohongshu parse error:', error);
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
