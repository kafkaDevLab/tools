'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, AlertCircle } from 'lucide-react';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '===='.slice(0, 4 - pad);
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

interface DecodedJwt {
  header: string;
  payload: string;
  headerParsed: Record<string, unknown> | null;
  payloadParsed: Record<string, unknown> | null;
  error: string | null;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: '',
      payload: '',
      headerParsed: null,
      payloadParsed: null,
      error: 'JWT는 header.payload.signature 3부분으로 구성되어야 합니다.',
    };
  }
  let headerParsed: Record<string, unknown> | null = null;
  let payloadParsed: Record<string, unknown> | null = null;
  let err: string | null = null;
  const headerRaw = base64UrlDecode(parts[0]);
  const payloadRaw = base64UrlDecode(parts[1]);
  try {
    headerParsed = JSON.parse(headerRaw) as Record<string, unknown>;
  } catch {
    err = 'Header JSON 파싱 실패';
  }
  try {
    payloadParsed = JSON.parse(payloadRaw) as Record<string, unknown>;
  } catch {
    err = err || 'Payload JSON 파싱 실패';
  }
  if (payloadParsed && typeof payloadParsed.exp === 'number') {
    const expDate = new Date(payloadParsed.exp * 1000);
    (payloadParsed as Record<string, unknown>).expReadable = expDate.toISOString() + (expDate.getTime() < Date.now() ? ' (만료됨)' : '');
  }
  if (payloadParsed && typeof payloadParsed.iat === 'number') {
    (payloadParsed as Record<string, unknown>).iatReadable = new Date(payloadParsed.iat * 1000).toISOString();
  }
  return {
    header: headerRaw,
    payload: payloadRaw,
    headerParsed,
    payloadParsed,
    error: err,
  };
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');

  const decoded = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Shield size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">JWT 디코더</h1>
              <p className="text-slate-500 text-sm">JWT 토큰을 붙여넣으면 Header·Payload를 읽기 쉽게 보여줍니다. (검증 없음)</p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">JWT 토큰</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {decoded && (
            <>
              {decoded.error && (
                <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertCircle size={18} /> {decoded.error}
                </div>
              )}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Header</h2>
                  <pre className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm overflow-auto max-h-64">
                    {decoded.headerParsed ? JSON.stringify(decoded.headerParsed, null, 2) : decoded.header || '(비어 있음)'}
                  </pre>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Payload</h2>
                  <pre className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm overflow-auto max-h-64">
                    {decoded.payloadParsed ? JSON.stringify(decoded.payloadParsed, null, 2) : decoded.payload || '(비어 있음)'}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
