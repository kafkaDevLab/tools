'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Download, AlertCircle, Loader2, Video, Image as ImageIcon, Clipboard } from 'lucide-react';

interface MediaImage {
  url: string;
  fallback: string;
}

interface ParseResult {
  type: 'image' | 'video';
  title: string;
  desc: string;
  cover: string | null;
  images: MediaImage[];
  video: { url: string; fallback: string | null } | null;
}

export default function XiaohongshuPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);

  const buildDownloadHref = (url: string, fallback: string | null, filename: string) => {
    const params = new URLSearchParams({ url, filename });
    if (fallback) params.set('fallback', fallback);
    return `/api/xiaohongshu/download?${params.toString()}`;
  };

  const handleParse = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('링크를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '처리에 실패했습니다.');
        return;
      }
      setResult(data as ParseResult);
    } catch (e) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      setError('클립보드를 읽을 수 없습니다. 직접 붙여넣어 주세요.');
    }
  };

  const safeTitle = (result?.title || 'xiaohongshu').slice(0, 40).replace(/\s+/g, '_') || 'xiaohongshu';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
              <Download size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">샤오홍슈 다운로드</h1>
              <p className="text-slate-500 text-sm">
                샤오홍슈(小红书) 링크만 붙여넣으면 이미지·동영상을 워터마크 없이 저장합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">공유 링크</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleParse()}
                  placeholder="예) http://xhslink.com/xxxx 또는 앱 공유 텍스트 전체"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Clipboard size={16} /> 붙여넣기
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                앱 공유 문구를 통째로 붙여넣어도 링크를 자동으로 인식합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleParse}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> 불러오는 중...
                </>
              ) : (
                <>
                  <Download size={18} /> 가져오기
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 text-amber-600 text-sm bg-amber-50 rounded-xl px-4 py-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}
          </div>

          {result && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <div className="flex items-center gap-2">
                {result.type === 'video' ? (
                  <Video size={18} className="text-rose-600" />
                ) : (
                  <ImageIcon size={18} className="text-rose-600" />
                )}
                <h2 className="text-base font-bold text-slate-900 line-clamp-2">
                  {result.title || '제목 없음'}
                </h2>
              </div>
              {result.desc && (
                <p className="text-sm text-slate-500 whitespace-pre-wrap line-clamp-4">
                  {result.desc}
                </p>
              )}

              {result.type === 'video' && result.video ? (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden bg-black">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={result.video.url}
                      poster={result.cover || undefined}
                      controls
                      playsInline
                      className="w-full max-h-[480px]"
                    />
                  </div>
                  <a
                    href={buildDownloadHref(
                      result.video.url,
                      result.video.fallback,
                      `${safeTitle}.mp4`
                    )}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors"
                  >
                    <Download size={18} /> 동영상 다운로드
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.images.map((img, i) => (
                      <div
                        key={i}
                        className="group relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-square"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.fallback}
                          alt={`이미지 ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={buildDownloadHref(
                            img.url,
                            img.fallback,
                            `${safeTitle}_${i + 1}.png`
                          )}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
                        >
                          <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg text-xs font-semibold text-slate-900 transition-opacity">
                            <Download size={14} /> 저장
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                  {result.images.length > 1 && (
                    <p className="text-xs text-slate-400 text-center">
                      각 이미지에 마우스를 올리면 개별 저장할 수 있습니다. (총 {result.images.length}장)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-xs text-slate-400 leading-relaxed">
            <p>· 개인적 용도로만 사용하고, 저작권이 있는 콘텐츠의 무단 배포는 삼가주세요.</p>
            <p>· 로그인이 필요한 비공개 콘텐츠나 만료된 링크는 가져올 수 없습니다.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
