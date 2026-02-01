'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileCode, Copy, Download, Upload, AlertCircle } from 'lucide-react';

type Mode = 'encode' | 'decode' | 'file-to-b64' | 'b64-to-file';

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode');
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [fileB64, setFileB64] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runEncode = () => {
    setError(null);
    try {
      setTextOutput(btoa(unescape(encodeURIComponent(textInput))));
    } catch (e) {
      setError('인코딩 실패');
      setTextOutput('');
    }
  };

  const runDecode = () => {
    setError(null);
    try {
      setTextOutput(decodeURIComponent(escape(atob(textInput))));
    } catch (e) {
      setError('디코딩 실패 (유효한 Base64가 아닐 수 있음)');
      setTextOutput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileB64(result.replace(/^data:[^;]+;base64,/, ''));
    };
    reader.readAsDataURL(file);
  };

  const downloadFromB64 = () => {
    if (!fileB64.trim()) return;
    setError(null);
    try {
      const binary = atob(fileB64.replace(/\s/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decoded-file';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('유효한 Base64가 아닙니다.');
    }
  };

  const copyOutput = async () => {
    const toCopy = mode === 'file-to-b64' ? fileB64 : textOutput;
    if (!toCopy) return;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const modes: { id: Mode; label: string }[] = [
    { id: 'encode', label: '텍스트 → Base64' },
    { id: 'decode', label: 'Base64 → 텍스트' },
    { id: 'file-to-b64', label: '파일 → Base64' },
    { id: 'b64-to-file', label: 'Base64 → 파일' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <FileCode size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">Base64 인코더·디코더</h1>
              <p className="text-slate-500 text-sm">텍스트와 파일을 Base64로 인코딩·디코딩하세요.</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === m.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {(mode === 'encode' || mode === 'decode') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {mode === 'encode' ? '텍스트' : 'Base64 문자열'}
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y"
                    placeholder={mode === 'encode' ? '인코딩할 텍스트' : 'Base64 문자열'}
                  />
                </div>
                <button
                  type="button"
                  onClick={mode === 'encode' ? runEncode : runDecode}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  {mode === 'encode' ? '인코딩' : '디코딩'}
                </button>
                {textOutput && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">결과</label>
                    <div className="flex gap-2">
                      <textarea
                        readOnly
                        value={textOutput}
                        rows={4}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm bg-slate-50 resize-y"
                      />
                      <button
                        type="button"
                        onClick={copyOutput}
                        className="shrink-0 h-fit inline-flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium hover:bg-slate-200"
                      >
                        {copied ? '복사됨' : '복사'}
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === 'file-to-b64' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">파일 선택</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload size={24} className="text-slate-400" />
                    <span className="text-slate-600">클릭하여 파일 선택</span>
                    <input type="file" className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>
                {fileB64 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Base64 결과</label>
                    <div className="flex gap-2">
                      <textarea
                        readOnly
                        value={fileB64}
                        rows={6}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 resize-y break-all"
                      />
                      <button
                        type="button"
                        onClick={copyOutput}
                        className="shrink-0 h-fit inline-flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium hover:bg-slate-200"
                      >
                        복사 <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === 'b64-to-file' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Base64 문자열</label>
                  <textarea
                    value={fileB64}
                    onChange={(e) => setFileB64(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y"
                    placeholder="Base64 문자열 붙여넣기"
                  />
                </div>
                <button
                  type="button"
                  onClick={downloadFromB64}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
                >
                  <Download size={18} /> 파일로 다운로드
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
