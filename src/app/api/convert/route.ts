import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const format = (formData.get('format') as string || 'webp') as OutputFormat;
        const quality = parseInt(formData.get('quality') as string) || 80;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let sharpInstance = sharp(buffer);

        // Get original metadata
        const metadata = await sharpInstance.metadata();

        let outputBuffer: Buffer;
        let mimeType: string;

        switch (format) {
            case 'jpeg':
                outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
                mimeType = 'image/jpeg';
                break;
            case 'png':
                outputBuffer = await sharpInstance.png({
                    compressionLevel: Math.round((100 - quality) / 10),
                    quality
                }).toBuffer();
                mimeType = 'image/png';
                break;
            case 'gif':
                outputBuffer = await sharpInstance.gif().toBuffer();
                mimeType = 'image/gif';
                break;
            case 'tiff':
                outputBuffer = await sharpInstance.tiff({ quality }).toBuffer();
                mimeType = 'image/tiff';
                break;
            case 'avif':
                outputBuffer = await sharpInstance.avif({ quality }).toBuffer();
                mimeType = 'image/avif';
                break;
            case 'webp':
            default:
                outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
                mimeType = 'image/webp';
                break;
        }

        return new NextResponse(outputBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Length': outputBuffer.length.toString(),
                'X-Original-Size': buffer.length.toString(),
                'X-Converted-Size': outputBuffer.length.toString(),
                'X-Original-Width': (metadata.width || 0).toString(),
                'X-Original-Height': (metadata.height || 0).toString(),
            },
        });
    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
