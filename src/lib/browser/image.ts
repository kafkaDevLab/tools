export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('이미지를 저장할 수 없습니다.')), mimeType, quality);
  });
}

export async function imageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('4천만 픽셀 이하 이미지로 다시 시도해 주세요.');
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('브라우저에서 이미지 편집을 지원하지 않습니다.');
    context.drawImage(bitmap, 0, 0);
    return canvas;
  } finally {
    bitmap.close();
  }
}
