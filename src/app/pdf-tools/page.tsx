'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';
import { downloadBlob, formatBytes } from '@/lib/browser/download';

type PdfItem = { id: string; file: File; pages: number };

function parsePages(input: string, count: number): number[] {
  const pages: number[] = [];
  for (const part of input.split(',')) {
    const value = part.trim();
    if (!value) continue;
    const match = /^(\d+)(?:-(\d+))?$/.exec(value);
    if (!match) throw new Error('페이지는 1-3,5처럼 입력해 주세요.');
    const first = Number(match[1]);
    const last = match[2] ? Number(match[2]) : first;
    if (first < 1 || last > count || first > last) throw new Error('페이지 번호가 문서 범위를 벗어났습니다.');
    for (let number = first; number <= last; number++) pages.push(number - 1);
  }
  if (!pages.length) throw new Error('추출할 페이지를 입력해 주세요.');
  return pages;
}

export default function PdfToolsPage() {
  const [mode, setMode] = useState<'merge' | 'extract'>('merge');
  const [items, setItems] = useState<PdfItem[]>([]);
  const [range, setRange] = useState('1-3');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadFiles = async (selected: File[]) => {
    setError('');
    setItems([]);
    try {
      if (selected.reduce((sum, file) => sum + file.size, 0) > 50 * 1024 * 1024) throw new Error('파일 합계가 50MB 이하가 되도록 선택해 주세요.');
      const { PDFDocument } = await import('pdf-lib');
      const next: PdfItem[] = [];
      for (const file of selected) {
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        next.push({ id: crypto.randomUUID(), file, pages: pdf.getPageCount() });
      }
      setItems(next);
      if (next[0]) setRange('1-' + next[0].pages);
    } catch (cause) {
      setError(cause instanceof Error && cause.message.includes('50MB') ? cause.message : 'PDF를 읽지 못했습니다. 암호화되지 않은 PDF인지 확인해 주세요.');
    }
  };

  const move = (index: number, step: number) => {
    const next = [...items];
    const target = index + step;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const makePdf = async () => {
    setError('');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const output = await PDFDocument.create();
      if (mode === 'merge') {
        if (items.length < 2) throw new Error('합칠 PDF를 2개 이상 선택해 주세요.');
        for (const item of items) {
          const input = await PDFDocument.load(await item.file.arrayBuffer());
          const pages = await output.copyPages(input, input.getPageIndices());
          pages.forEach((page) => output.addPage(page));
        }
      } else {
        if (!items[0]) throw new Error('PDF를 선택해 주세요.');
        const input = await PDFDocument.load(await items[0].file.arrayBuffer());
        const pages = await output.copyPages(input, parsePages(range, input.getPageCount()));
        pages.forEach((page) => output.addPage(page));
      }
      const bytes = await output.save();
      downloadBlob(new Blob([Uint8Array.from(bytes)], { type: 'application/pdf' }), mode === 'merge' ? 'merged.pdf' : 'extracted.pdf');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'PDF를 만들지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPage title="PDF 합치기·페이지 추출" description="여러 PDF의 순서를 정해 합치거나, 필요한 페이지만 골라 저장하세요." note="PDF는 브라우저에서만 처리하며 서버에 업로드하거나 저장하지 않습니다. 암호가 걸린 문서는 지원하지 않습니다.">
      <div className="flex gap-2">
        <button type="button" onClick={() => { setMode('merge'); setItems([]); setError(''); }} className={mode === 'merge' ? 'rounded-lg bg-blue-600 px-4 py-2 text-white' : 'rounded-lg border border-slate-300 px-4 py-2'}>PDF 합치기</button>
        <button type="button" onClick={() => { setMode('extract'); setItems([]); setError(''); }} className={mode === 'extract' ? 'rounded-lg bg-blue-600 px-4 py-2 text-white' : 'rounded-lg border border-slate-300 px-4 py-2'}>페이지 추출</button>
      </div>
      <label className="block text-sm font-semibold">PDF 선택
        <input type="file" accept="application/pdf,.pdf" multiple={mode === 'merge'} onChange={(event) => loadFiles(Array.from(event.target.files || []))} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      {items.length > 0 && <div className="space-y-2">
        {items.map((item, index) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
          <span className="min-w-0 break-all text-sm">{index + 1}. {item.file.name} · {item.pages}페이지 · {formatBytes(item.file.size)}</span>
          {mode === 'merge' && <span className="flex shrink-0 gap-1"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={item.file.name + ' 위로'} className="rounded border px-2 disabled:opacity-30">↑</button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label={item.file.name + ' 아래로'} className="rounded border px-2 disabled:opacity-30">↓</button></span>}
        </div>)}
      </div>}
      {mode === 'extract' && items[0] && <label className="block text-sm font-semibold">추출할 페이지 (예: 1-3,5)
        <input value={range} onChange={(event) => setRange(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
        <span className="mt-1 block font-normal text-slate-500">총 {items[0].pages}페이지 · 입력한 순서대로 새 PDF에 들어갑니다.</span>
      </label>}
      <button type="button" disabled={busy || !items.length} onClick={makePdf} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? '처리 중...' : mode === 'merge' ? '합쳐서 다운로드' : '추출해서 다운로드'}</button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </ToolPage>
  );
}
