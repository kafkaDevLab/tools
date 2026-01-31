'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileJson, CheckCircle2, AlertCircle, Copy, Braces, RefreshCw } from 'lucide-react';

// Dynamic import for react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default function JsonFormatterPage() {
    const [input, setInput] = useState('');
    const [json, setJson] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        validateJson(input);
    }, [input]);

    const validateJson = (text: string) => {
        if (!text.trim()) {
            setJson(null);
            setError(null);
            return;
        }

        try {
            const parsed = JSON.parse(text);
            setJson(parsed);
            setError(null);
        } catch (err) {
            setJson(null);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const handleFormat = () => {
        if (!json) return;
        setInput(JSON.stringify(json, null, 2));
    };

    const handleCopy = () => {
        if (!json) return;
        navigator.clipboard.writeText(JSON.stringify(json, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] min-h-[600px] flex flex-col">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 flex items-center justify-center gap-2">
                            <FileJson className="text-yellow-600" />
                            JSON 포맷터 & 검증기
                        </h1>
                        <p className="text-slate-500">JSON 데이터를 검증하고 보기 좋게 정렬합니다.</p>
                    </div>

                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        {/* Input Section */}
                        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <label className="font-semibold text-slate-700">입력 (Input)</label>
                                <button
                                    onClick={handleFormat}
                                    disabled={!!error || !input}
                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Braces size={14} /> 정렬하기 (Prettier)
                                </button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='여기에 JSON을 붙여넣으세요...'
                                className="flex-grow w-full p-4 resize-none focus:outline-none font-mono text-sm bg-white text-slate-800"
                                spellCheck={false}
                            />
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center h-[60px]">
                                <label className="font-semibold text-slate-700 flex items-center gap-2">
                                    검증 결과 (Result)
                                    {input && !error && <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle2 size={10} /> Valid</span>}
                                    {error && <span className="text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1"><AlertCircle size={10} /> Invalid</span>}
                                </label>
                                <button
                                    onClick={handleCopy}
                                    disabled={!!error || !input}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    {copied ? '복사됨' : '복사하기'}
                                </button>
                            </div>

                            <div className="flex-grow overflow-auto p-4 bg-slate-900 font-mono text-sm relative">
                                {error ? (
                                    <div className="text-red-400 p-4 bg-red-900/20 rounded-lg border border-red-900/50">
                                        <h3 className="font-bold flex items-center gap-2 mb-2">
                                            <AlertCircle size={16} /> JSON 오류 발생
                                        </h3>
                                        <p>{error}</p>
                                    </div>
                                ) : json ? (
                                    <ReactJson
                                        src={json}
                                        theme="ocean"
                                        displayDataTypes={false}
                                        style={{ backgroundColor: 'transparent' }}
                                        enableClipboard={false}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-600">
                                        <p>JSON을 입력하면 결과를 미리볼 수 있습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
