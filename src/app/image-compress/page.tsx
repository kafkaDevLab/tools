'use client';

import React, { useEffect, useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';
import { canvasToBlob, imageToCanvas } from '@/lib/browser/image';
import { downloadBlob, formatBytes, replaceExtension } from '@/lib/browser/download';

type Result = { name: string; original: number; blob: Blob; beforeUrl: string; afterUrl: string; reached: boolean; extension: string };

export default function ImageCompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg'>('image/webp');
  const [targetKb, setTargetKb] = useState(300);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => {
    results.forEach((item) => {
      URL.revokeObjectURL(item.beforeUrl);
      URL.revokeObjectURL(item.afterUrl);
    });
  }, [results]);

  const compress = async () => {
    setBusy(true);
    setError('');
    const output: Result[] = [];
    try {
      for (const file of files) {
        if (file.size > 20 * 1024 * 1024) throw new Error(file.name + ': 20MB 이하 파일을 선택해 주세요.');
        let canvas = await imageToCanvas(file);
        if (format === 'image/jpeg') {
          const flat = document.createElement('canvas');
          flat.width = canvas.width;
          flat.height = canvas.height;
          const context = flat.getContext('2d');
          if (!context) throw new Error('브라우저에서 이미지 편집을 지원하지 않습니다.');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, flat.width, flat.height);
          context.drawImage(canvas, 0, 0);
          canvas = flat;
        }
        const target = targetKb * 1024;
        let low = 0.05;
        let high = 0.95;
        let best = await canvasToBlob(canvas, format, low);
        if (best.type !== format) throw new Error('이 브라우저는 선택한 출력 형식을 지원하지 않습니다.');
        for (let attempt = 0; attempt < 8; attempt++) {
          const quality = (low + high) / 2;
          const candidate = await canvasToBlob(canvas, format, quality);
          if (candidate.size <= target) {
            best = candidate;
            low = quality;
          } else {
            high = quality;
          }
        }
        output.push({
          name: file.name,
          original: file.size,
          blob: best,
          beforeUrl: URL.createObjectURL(file),
          afterUrl: URL.createObjectURL(best),
          reached: best.size <= target,
          extension: format === 'image/webp' ? 'webp' : 'jpg',
        });
      }
      setResults(output);
    } catch (cause) {
      output.forEach((item) => {
        URL.revokeObjectURL(item.beforeUrl);
        URL.revokeObjectURL(item.afterUrl);
      });
      setError(cause instanceof Error ? cause.message : '이미지를 압축하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    results.forEach((item, index) => zip.file((index + 1) + '-' + replaceExtension(item.name, item.extension), item.blob));
    downloadBlob(await zip.generateAsync({ type: 'blob' }), 'compressed-images.zip');
  };

  return (
    <ToolPage title="이미지 용량 줄이기" description="목표 용량을 정하고 여러 이미지를 압축한 뒤 전후 크기를 비교하세요." note="이미지는 브라우저에서만 처리하며 서버에 업로드하거나 저장하지 않습니다. 목표 용량은 이미지 내용에 따라 달성하지 못할 수 있습니다.">
      <div>
        <label htmlFor="compress-files" className="block text-sm font-semibold mb-2">이미지 선택 (JPG·PNG·WebP, 최대 20MB/장)</label>
        <input id="compress-files" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => {
          setFiles(Array.from(event.target.files || []));
          setResults([]);
        }} className="block w-full rounded-xl border border-slate-200 p-3 text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">출력 형식
          <select value={format} onChange={(event) => { setFormat(event.target.value as typeof format); setResults([]); }} className="mt-2 block w-full rounded-xl border border-slate-200 p-3">
            <option value="image/webp">WebP</option><option value="image/jpeg">JPG (투명 배경 없음)</option>
          </select>
        </label>
        <label className="text-sm font-semibold">목표 용량 (KB)
          <input type="number" min="10" max="20000" value={targetKb} onChange={(event) => { setTargetKb(Math.min(20000, Math.max(10, Number(event.target.value) || 10))); setResults([]); }} className="mt-2 block w-full rounded-xl border border-slate-200 p-3" />
        </label>
      </div>
      <button type="button" disabled={!files.length || busy} onClick={compress} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? '압축 중...' : files.length + '개 이미지 압축'}</button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {results.length > 0 && <div className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="font-bold">결과</h2>{results.length > 1 && <button type="button" onClick={downloadAll} className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600">ZIP 다운로드</button>}</div>
        {results.map((item, index) => <div key={item.name + index} className="rounded-xl border border-slate-200 p-4">
          <p className="font-medium break-all">{item.name}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-slate-500">
            <div><img src={item.beforeUrl} alt="압축 전" className="h-36 w-full object-contain rounded-lg bg-slate-50" /><p className="mt-1">원본 {formatBytes(item.original)}</p></div>
            <div><img src={item.afterUrl} alt="압축 후" className="h-36 w-full object-contain rounded-lg bg-slate-50" /><p className="mt-1">결과 {formatBytes(item.blob.size)}</p></div>
          </div>
          {!item.reached && <p className="mt-2 text-sm text-amber-700">이 이미지에서는 목표 용량에 도달하지 못했습니다.</p>}
          <button type="button" onClick={() => downloadBlob(item.blob, replaceExtension(item.name, item.extension))} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">다운로드</button>
        </div>)}
      </div>}
    </ToolPage>
  );
}
