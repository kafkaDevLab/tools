import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'avif';
const MIME_TYPES = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    avif: 'image/avif',
} as const;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const INPUT_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic']);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const format = String(formData.get('format') || 'webp') as OutputFormat;
        const quality = Number(formData.get('quality') || 80);

        if (!(file instanceof File) || !INPUT_TYPES.has(file.type)) {
            return NextResponse.json({ error: '이미지 파일이 필요합니다.' }, { status: 400 });
        }
        if (!(format in MIME_TYPES) || !Number.isInteger(quality) || quality < 1 || quality > 100) {
            return NextResponse.json({ error: '변환 형식 또는 품질 값이 올바르지 않습니다.' }, { status: 400 });
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: '이미지 크기는 20MB 이하여야 합니다.' }, { status: 413 });
        }

        const images = getCloudflareContext().env.IMAGES;
        if (!images) throw new Error('Cloudflare Images binding is missing');
        const metadata = await images.info(file.stream());
        const transformed = await images.input(file.stream()).output({
            format: MIME_TYPES[format],
            quality: format === 'png' || format === 'gif' ? undefined : quality,
            anim: format === 'gif',
        });
        const result = transformed.response();
        result.headers.set('Cache-Control', 'no-store');
        result.headers.set('X-Content-Type-Options', 'nosniff');
        result.headers.set('X-Original-Size', String(file.size));
        result.headers.set('X-Original-Width', String('width' in metadata ? metadata.width : 0));
        result.headers.set('X-Original-Height', String('height' in metadata ? metadata.height : 0));
        return result;
    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: '이미지 변환에 실패했습니다. 지원되는 형식인지 확인해 주세요.' }, { status: 500 });
    }
}
