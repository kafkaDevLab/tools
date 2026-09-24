'use client';

import React, { useEffect, useRef, useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';
import { canvasToBlob, imageToCanvas } from '@/lib/browser/image';
import { downloadBlob, replaceExtension } from '@/lib/browser/download';

type Crop = { x: number; y: number; width: number; height: number };

export default function ImageCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 0, height: 0 });
  const [ratio, setRatio] = useState('free');
  const [format, setFormat] = useState('image/png');
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerX: number; pointerY: number; cropX: number; cropY: number } | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const loadFile = async (selected: File | undefined) => {
    if (!selected) return;
    setError('');
    try {
      if (selected.size > 20 * 1024 * 1024) throw new Error('20MB 이하 이미지를 선택해 주세요.');
      const bitmap = await createImageBitmap(selected);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      if (dimensions.width * dimensions.height > 40_000_000) throw new Error('4천만 픽셀 이하 이미지를 선택해 주세요.');
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setSize(dimensions);
      setCrop({ x: 0, y: 0, width: dimensions.width, height: dimensions.height });
      setRatio('free');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '이미지를 열 수 없습니다.');
    }
  };

  const setField = (field: keyof Crop, value: number) => {
    const next = { ...crop, [field]: Math.max(0, Math.floor(value || 0)) };
    next.width = Math.min(Math.max(1, next.width), size.width);
    next.height = Math.min(Math.max(1, next.height), size.height);
    next.x = Math.min(next.x, size.width - next.width);
    next.y = Math.min(next.y, size.height - next.height);
    setCrop(next);
    setRatio('free');
  };

  const selectRatio = (value: string) => {
    setRatio(value);
    if (value === 'free') return;
    const [w, h] = value.split(':').map(Number);
    const desired = w / h;
    let width = size.width;
    let height = Math.round(width / desired);
    if (height > size.height) {
      height = size.height;
      width = Math.round(height * desired);
    }
    setCrop({ x: Math.floor((size.width - width) / 2), y: Math.floor((size.height - height) / 2), width, height });
  };

  const moveCrop = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const nextX = dragRef.current.cropX + (event.clientX - dragRef.current.pointerX) * size.width / rect.width;
    const nextY = dragRef.current.cropY + (event.clientY - dragRef.current.pointerY) * size.height / rect.height;
    setCrop((current) => ({
      ...current,
      x: Math.min(size.width - current.width, Math.max(0, Math.round(nextX))),
      y: Math.min(size.height - current.height, Math.max(0, Math.round(nextY))),
    }));
  };

  const rotate = async (clockwise: boolean) => {
    if (!file) return;
    setError('');
    try {
      const source = await imageToCanvas(file);
      const output = document.createElement('canvas');
      output.width = source.height;
      output.height = source.width;
      const context = output.getContext('2d');
      if (!context) throw new Error('브라우저에서 이미지 편집을 지원하지 않습니다.');
      context.translate(clockwise ? output.width : 0, clockwise ? 0 : output.height);
      context.rotate(clockwise ? Math.PI / 2 : -Math.PI / 2);
      context.drawImage(source, 0, 0);
      const rotated = await canvasToBlob(output, 'image/png');
      await loadFile(new File([rotated], replaceExtension(file.name, 'png'), { type: 'image/png' }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '이미지를 회전하지 못했습니다.');
    }
  };

  const save = async () => {
    if (!file) return;
    setError('');
    try {
      const source = await imageToCanvas(file);
      const output = document.createElement('canvas');
      output.width = crop.width;
      output.height = crop.height;
      const context = output.getContext('2d');
      if (!context) throw new Error('브라우저에서 이미지 편집을 지원하지 않습니다.');
      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, output.width, output.height);
      }
      context.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      const blob = await canvasToBlob(output, format, 0.9);
      const extension = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
      downloadBlob(blob, replaceExtension(file.name, 'cropped.' + extension));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '이미지를 저장하지 못했습니다.');
    }
  };

  return (
    <ToolPage title="이미지 자르기·회전" description="비율을 선택하고 자를 영역을 드래그해 위치를 조절하세요." note="이미지는 브라우저에서만 편집되며 서버에 업로드하거나 저장하지 않습니다.">
      <label className="block text-sm font-semibold">이미지 선택
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => loadFile(event.target.files?.[0])} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      {file && <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">자르기 비율
            <select value={ratio} onChange={(event) => selectRatio(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3"><option value="free">자유</option><option value="1:1">1:1 프로필</option><option value="4:3">4:3</option><option value="16:9">16:9 썸네일</option><option value="9:16">9:16 세로</option></select>
          </label>
          <label className="text-sm font-semibold">출력 형식
            <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['x', 'y', 'width', 'height'] as const).map((field) => <label key={field} className="text-sm font-semibold">{({ x: '왼쪽', y: '위쪽', width: '너비', height: '높이' })[field]} (px)
            <input type="number" min={field === 'width' || field === 'height' ? 1 : 0} value={crop[field]} onChange={(event) => setField(field, Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 p-2" />
          </label>)}
        </div>
        <p className="text-sm text-slate-500">원본 {size.width} × {size.height}px · 파란 영역을 드래그해 이동할 수 있습니다.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => rotate(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">↶ 왼쪽 90°</button>
          <button type="button" onClick={() => rotate(true)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">↷ 오른쪽 90°</button>
        </div>
        <div ref={previewRef} className="relative mx-auto select-none overflow-hidden bg-slate-100" style={{ width: 'min(100%, 600px)', aspectRatio: size.width + ' / ' + size.height }}>
          <img src={preview} alt="원본 이미지 미리보기" className="absolute inset-0 h-full w-full" draggable={false} />
          <div className="absolute border-2 border-blue-500 bg-blue-500/15 touch-none cursor-move" style={{ left: crop.x / size.width * 100 + '%', top: crop.y / size.height * 100 + '%', width: crop.width / size.width * 100 + '%', height: crop.height / size.height * 100 + '%' }}
            onPointerDown={(event) => {
              dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, cropX: crop.x, cropY: crop.y };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={moveCrop}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
          />
        </div>
        <button type="button" onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">잘라서 다운로드</button>
      </div>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </ToolPage>
  );
}
