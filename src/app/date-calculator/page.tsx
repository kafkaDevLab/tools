'use client';

import React, { useMemo, useState } from 'react';
import ToolPage from '@/components/layout/ToolPage';

const DAY = 86_400_000;

function utcDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

function businessDaysBetween(start: Date, end: Date): number {
  const direction = start <= end ? 1 : -1;
  let count = 0;
  for (let time = start.getTime() + direction * DAY; direction > 0 ? time <= end.getTime() : time >= end.getTime(); time += direction * DAY) {
    const day = new Date(time).getUTCDay();
    if (day !== 0 && day !== 6) count += direction;
  }
  return count;
}

function offsetDate(start: Date, amount: number, businessOnly: boolean): Date {
  const result = new Date(start);
  const direction = amount >= 0 ? 1 : -1;
  let remaining = Math.abs(amount);
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + direction);
    const day = result.getUTCDay();
    if (!businessOnly || (day !== 0 && day !== 6)) remaining--;
  }
  return result;
}

export default function DateCalculatorPage() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [amount, setAmount] = useState(30);
  const [businessOnly, setBusinessOnly] = useState(false);
  const result = useMemo(() => {
    const from = utcDate(start);
    const to = utcDate(end);
    if (!from) return null;
    const days = to ? Math.round((to.getTime() - from.getTime()) / DAY) : null;
    if (days !== null && Math.abs(days) > 36_600) return { error: '날짜 차이는 100년 이내로 선택해 주세요.' };
    const safeAmount = Math.max(-36_600, Math.min(36_600, Math.trunc(amount || 0)));
    return {
      days,
      business: to ? businessDaysBetween(from, to) : null,
      offset: offsetDate(from, safeAmount, businessOnly).toISOString().slice(0, 10),
    };
  }, [start, end, amount, businessOnly]);

  return (
    <ToolPage title="날짜·영업일 계산기" description="두 날짜의 차이를 구하거나 기준일에서 며칠 전·후 날짜를 계산하세요." note="영업일은 토요일과 일요일만 제외합니다. 공휴일과 대체공휴일은 반영하지 않습니다. 시작일은 세지 않고 종료일은 셉니다.">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">시작일·기준일<input type="date" value={start} onChange={(event) => setStart(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3" /></label>
        <label className="text-sm font-semibold">종료일<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3" /></label>
      </div>
      {result && 'error' in result && <p role="alert" className="text-sm text-red-600">{result.error}</p>}
      {result && 'days' in result && result.days !== null && <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-blue-50 p-5"><p className="text-sm text-slate-600">날짜 차이</p><p className="text-2xl font-bold">{result.days}일</p></div>
        <div className="rounded-xl bg-blue-50 p-5"><p className="text-sm text-slate-600">주말 제외</p><p className="text-2xl font-bold">{result.business}영업일</p></div>
      </div>}
      <div className="border-t border-slate-200 pt-5 space-y-4">
        <h2 className="font-bold">기준일에서 날짜 더하기·빼기</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">일수 (음수는 이전 날짜)
            <input type="number" min="-36600" max="36600" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block w-full rounded-xl border border-slate-200 p-3" />
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" checked={businessOnly} onChange={(event) => setBusinessOnly(event.target.checked)} /> 주말 제외하고 계산</label>
        </div>
        {result && 'offset' in result && <div className="rounded-xl bg-slate-100 p-5"><p className="text-sm text-slate-600">계산된 날짜</p><p className="text-2xl font-bold">{result.offset}</p></div>}
      </div>
    </ToolPage>
  );
}
