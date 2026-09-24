'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import ToolPage from '@/components/layout/ToolPage';

const fields = [
  { key: 'utm_source', label: '유입 출처', placeholder: 'newsletter' },
  { key: 'utm_medium', label: '매체', placeholder: 'email' },
  { key: 'utm_campaign', label: '캠페인', placeholder: 'autumn_sale' },
  { key: 'utm_content', label: '콘텐츠 (선택)', placeholder: 'top_button' },
  { key: 'utm_term', label: '검색어 (선택)', placeholder: 'running_shoes' },
] as const;

type FieldKey = typeof fields[number]['key'];

export default function UtmBuilderPage() {
  const [base, setBase] = useState('');
  const [values, setValues] = useState<Record<FieldKey, string>>({ utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '' });
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!base.trim()) return { url: '', error: '' };
    try {
      const url = new URL(base.trim());
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('http 또는 https 주소만 입력해 주세요.');
      if (!values.utm_source.trim() || !values.utm_medium.trim() || !values.utm_campaign.trim()) return { url: '', error: '출처·매체·캠페인을 입력해 주세요.' };
      fields.forEach(({ key }) => {
        url.searchParams.delete(key);
        if (values[key].trim()) url.searchParams.set(key, values[key].trim());
      });
      return { url: url.toString(), error: '' };
    } catch (cause) {
      return { url: '', error: cause instanceof Error ? cause.message : '올바른 URL을 입력해 주세요.' };
    }
  }, [base, values]);

  return (
    <ToolPage title="UTM 링크 생성기" description="캠페인 정보를 붙인 링크를 만들고 기존 QR 코드 도구로 바로 보낼 수 있습니다." note="입력한 링크는 브라우저에서만 조합되며 서버나 DB에 저장하지 않습니다. QR 코드 도구로 보낼 때는 이 탭의 임시 저장 공간을 사용합니다.">
      <label className="block text-sm font-semibold">기본 URL
        <input type="url" value={base} onChange={(event) => setBase(event.target.value)} placeholder="https://example.com/page" className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => <label key={field.key} className="text-sm font-semibold">{field.label}
          <input value={values[field.key]} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); setCopied(false); }} placeholder={field.placeholder} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal" />
        </label>)}
      </div>
      {result.error && <p role="status" className="text-sm text-amber-700">{result.error}</p>}
      {result.url && <div className="space-y-3 rounded-xl bg-blue-50 p-4">
        <p className="font-semibold">완성된 링크</p>
        <p className="break-all font-mono text-sm">{result.url}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={async () => { await navigator.clipboard.writeText(result.url); setCopied(true); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">{copied ? '복사됨' : '링크 복사'}</button>
          <Link href="/qr-generator" onClick={() => sessionStorage.setItem('dailytools:qr-prefill', result.url)} className="rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-700">QR 코드 만들기</Link>
        </div>
      </div>}
    </ToolPage>
  );
}
