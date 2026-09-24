'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';
import { canvasToBlob, imageToCanvas } from '@/lib/browser/image';
import { downloadBlob, formatBytes, replaceExtension } from '@/lib/browser/download';

export default function ImageMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [cleaned, setCleaned] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const inspect = async (selected: File | undefined) => {
    setFile(null);
    setMetadata(null);
    setCleaned(null);
    setError('');
    if (!selected) return;
    try {
      if (selected.size > 20 * 1024 * 1024) throw new Error('20MB 이하 이미지를 선택해 주세요.');
      const exifr = await import('exifr');
      const data = await exifr.parse(selected);
      setFile(selected);
      setMetadata(data || {});
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '메타데이터를 읽지 못했습니다.');
    }
  };

  const remove = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const canvas = await imageToCanvas(file);
      const mimeType = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      if (mimeType === 'image/jpeg') {
        const flat = document.createElement('canvas');
        flat.width = canvas.width;
        flat.height = canvas.height;
        const context = flat.getContext('2d');
        if (!context) throw new Error('브라우저에서 이미지 편집을 지원하지 않습니다.');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, flat.width, flat.height);
        context.drawImage(canvas, 0, 0);
        const blob = await canvasToBlob(flat, mimeType, 0.92);
        setCleaned(blob);
      } else {
        setCleaned(await canvasToBlob(canvas, mimeType, 0.92));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '정보를 제거하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const gps = metadata && ('latitude' in metadata || 'longitude' in metadata || 'GPSLatitude' in metadata || 'GPSLongitude' in metadata);
  const filename = file && replaceExtension(file.name, 'clean.' + (file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'));

  return (
    <ToolPage title="사진 위치정보·메타데이터 제거" description="사진에 포함된 위치정보와 촬영 정보를 확인하고 제거한 사본을 받으세요." note="파일은 브라우저에서만 처리하며 서버에 업로드하거나 저장하지 않습니다. 새 이미지로 다시 인코딩하므로 화질이나 파일 크기가 달라질 수 있습니다.">
      <label className="block text-sm font-semibold">사진 선택 (JPG·PNG·WebP)
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => inspect(event.target.files?.[0])} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      {file && <div className="space-y-4">
        <p className="text-sm text-slate-600">{file.name} · {formatBytes(file.size)}</p>
        {metadata && <>
          <p className={gps ? 'text-sm font-semibold text-amber-700' : 'text-sm font-semibold text-slate-600'}>{gps ? '위치정보가 포함되어 있습니다.' : '확인된 GPS 위치정보가 없습니다.'}</p>
          <details className="rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer font-medium">확인된 메타데이터 보기</summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-all text-xs">{Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '표시할 메타데이터가 없습니다.'}</pre>
          </details>
        </>}
        <button type="button" disabled={busy} onClick={remove} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? '제거 중...' : '메타데이터 제거'}</button>
        {cleaned && filename && <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-green-800">새 파일 생성 완료 · {formatBytes(cleaned.size)}</p>
          <button type="button" onClick={() => downloadBlob(cleaned, filename)} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">제거한 사진 다운로드</button>
        </div>}
      </div>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </ToolPage>
  );
}
