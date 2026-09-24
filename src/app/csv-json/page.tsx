'use client';

import React, { useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';
import { downloadBlob } from '@/lib/browser/download';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let afterQuote = false;
  let line = 1;
  const input = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') { cell += '"'; index++; }
      else if (char === '"') { quoted = false; afterQuote = true; }
      else { cell += char; if (char === '\n') line++; }
    } else if (afterQuote) {
      if (char === ',') { row.push(cell); cell = ''; afterQuote = false; }
      else if (char === '\n' || char === '\r') {
        row.push(cell); rows.push(row); row = []; cell = ''; afterQuote = false;
        if (char === '\r' && input[index + 1] === '\n') index++;
        line++;
      } else if (char !== ' ' && char !== '\t') throw new Error(line + '행: 닫는 따옴표 뒤에 잘못된 문자가 있습니다.');
    } else if (char === '"' && cell === '') quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n' || char === '\r') {
      row.push(cell); rows.push(row); row = []; cell = '';
      if (char === '\r' && input[index + 1] === '\n') index++;
      line++;
    } else if (char === '"') throw new Error(line + '행: 따옴표는 셀 시작에서만 사용할 수 있습니다.');
    else cell += char;
  }
  if (quoted) throw new Error(line + '행: 따옴표가 닫히지 않았습니다.');
  if (cell || row.length || afterQuote) { row.push(cell); rows.push(row); }
  return rows;
}

function csvCell(value: unknown): string {
  let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
  return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export default function CsvJsonPage() {
  const [mode, setMode] = useState<'csv' | 'json'>('csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setOutput('');
    setSummary('');
    try {
      if (!input.trim()) throw new Error('변환할 데이터를 입력해 주세요.');
      if (mode === 'csv') {
        const rows = parseCsv(input);
        if (rows.length < 2) throw new Error('첫 행의 열 이름과 데이터 행이 필요합니다.');
        const header = rows[0].map((value) => value.trim());
        if (header.some((value) => !value) || new Set(header).size !== header.length) throw new Error('첫 행의 열 이름은 비어 있거나 중복될 수 없습니다.');
        const objects = rows.slice(1).filter((row) => row.some((value) => value !== '')).map((row, index) => {
          if (row.length > header.length) throw new Error((index + 2) + '행: 열 개수가 첫 행보다 많습니다.');
          return Object.fromEntries(header.map((key, column) => [key, row[column] ?? '']));
        });
        setOutput(JSON.stringify(objects, null, 2));
        setSummary(objects.length + '개 행 · ' + header.length + '개 열');
      } else {
        const data: unknown = JSON.parse(input);
        if (!Array.isArray(data) || !data.every((row) => row && typeof row === 'object' && !Array.isArray(row))) throw new Error('JSON 객체 배열을 입력해 주세요.');
        if (!data.length) throw new Error('빈 배열은 CSV로 변환할 수 없습니다.');
        const rows = data as Record<string, unknown>[];
        const header = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
        setOutput([header.map(csvCell).join(','), ...rows.map((row) => header.map((key) => csvCell(row[key])).join(','))].join('\r\n'));
        setSummary(rows.length + '개 행 · ' + header.length + '개 열');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '변환하지 못했습니다.');
    }
  };

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('5MB 이하 파일을 선택해 주세요.'); return; }
    setInput(await file.text());
    setOutput('');
    setError('');
  };

  return (
    <ToolPage title="CSV ↔ JSON 변환" description="표 데이터와 JSON 객체 배열을 변환하고 결과를 미리 확인하세요." note="데이터는 브라우저에서만 처리하며 서버에 업로드하거나 저장하지 않습니다. CSV로 내보낼 때 스프레드시트 수식으로 오인될 수 있는 값은 앞에 작은따옴표를 붙입니다.">
      <div className="flex gap-2">
        <button type="button" onClick={() => { setMode('csv'); setInput(''); setOutput(''); }} className={mode === 'csv' ? 'rounded-lg bg-blue-600 px-4 py-2 text-white' : 'rounded-lg border px-4 py-2'}>CSV → JSON</button>
        <button type="button" onClick={() => { setMode('json'); setInput(''); setOutput(''); }} className={mode === 'json' ? 'rounded-lg bg-blue-600 px-4 py-2 text-white' : 'rounded-lg border px-4 py-2'}>JSON → CSV</button>
      </div>
      <label className="block text-sm font-semibold">파일 불러오기 (최대 5MB)
        <input type="file" accept={mode === 'csv' ? '.csv,text/csv,text/plain' : '.json,application/json,text/plain'} onChange={(event) => loadFile(event.target.files?.[0])} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      <label className="block text-sm font-semibold">입력
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={10} spellCheck={false} placeholder={mode === 'csv' ? 'name,age\nKim,30' : '[{"name":"Kim","age":30}]'} className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-mono text-sm" />
      </label>
      <button type="button" onClick={convert} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">변환</button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {output && <div className="space-y-3">
        <p className="font-semibold">결과 미리보기 · {summary}</p>
        <textarea readOnly value={output} rows={12} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm" />
        <button type="button" onClick={() => downloadBlob(new Blob([output], { type: mode === 'csv' ? 'application/json' : 'text/csv;charset=utf-8' }), mode === 'csv' ? 'converted.json' : 'converted.csv')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">파일 다운로드</button>
      </div>}
    </ToolPage>
  );
}
