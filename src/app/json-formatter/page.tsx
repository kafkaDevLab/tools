'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileJson, CheckCircle2, AlertCircle, Copy, Braces, Trash2 } from 'lucide-react';

// Dynamic import for react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface JsonError {
    message: string;
    line?: number;
    column?: number;
    snippet?: string;
}

export default function JsonFormatterPage() {
    const EXAMPLE_JSON = {
        "project": "Daily Tools",
        "version": "1.0.0",
        "features": [
            "26-Week Savings Calculator",
            "Lotto Number Generator",
            "Dividend Calculator",
            "Image Converter (WebP)",
            "JSON Formatter"
        ],
        "isFree": true,
        "author": {
            "name": "Daily Tools Team",
            "contact": "contact@example.com"
        }
    };

    const [input, setInput] = useState(JSON.stringify(EXAMPLE_JSON, null, 2));
    const [json, setJson] = useState<object | null>(null);
    const [errorDetails, setErrorDetails] = useState<JsonError | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        validateJson(input);
    }, [input]);

    const validateJson = (text: string) => {
        if (!text.trim()) {
            setJson(null);
            setErrorDetails(null);
            return;
        }

        try {
            const parsed = JSON.parse(text);
            setJson(parsed);
            setErrorDetails(null);
        } catch (err) {
            setJson(null);
            if (err instanceof Error) {
                const message = err.message;

                // Try to extract position/line info from standard JSON.parse error
                // Chrome/Node: "...at position 12"
                // Firefox: "...at line 2 column 5"
                const posMatch = message.match(/at position (\d+)/);
                const lineColMatch = message.match(/at line (\d+) column (\d+)/);

                let line, column;

                if (posMatch) {
                    const position = parseInt(posMatch[1], 10);
                    const before = text.slice(0, position);
                    const lines = before.split('\n');
                    line = lines.length;
                    column = lines[lines.length - 1].length + 1;
                } else if (lineColMatch) {
                    line = parseInt(lineColMatch[1], 10);
                    column = parseInt(lineColMatch[2], 10);
                }

                // Create a small snippet around the error
                let snippet = "";
                if (line !== undefined && column !== undefined) {
                    const lines = text.split('\n');
                    const errorLine = lines[line - 1];
                    if (errorLine) {
                        snippet = errorLine;
                    }
                }

                setErrorDetails({
                    message: message.replace(/at position \d+/, '').replace(/at line \d+ column \d+/, '').trim(),
                    line,
                    column,
                    snippet
                });
            } else {
                setErrorDetails({ message: '알 수 없는 JSON 오류가 발생했습니다.' });
            }
        }
    };

    const handleFormat = () => {
        if (!json) return;
        setInput(JSON.stringify(json, null, 2));
    };

    const handleClear = () => {
        setInput('');
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleClear}
                                        className="bg-white border border-slate-300 text-slate-500 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        <Trash2 size={14} /> 지우기
                                    </button>
                                    <button
                                        onClick={handleFormat}
                                        disabled={!!errorDetails || !input}
                                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Braces size={14} /> 정렬하기
                                    </button>
                                </div>
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
                                    {input && !errorDetails && <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle2 size={10} /> Valid</span>}
                                    {errorDetails && <span className="text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1"><AlertCircle size={10} /> Invalid</span>}
                                </label>
                                <button
                                    onClick={handleCopy}
                                    disabled={!!errorDetails || !input}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                                >
                                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    {copied ? '복사됨' : '복사하기'}
                                </button>
                            </div>

                            <div className="flex-grow overflow-auto p-4 bg-slate-900 font-mono text-sm relative">
                                {errorDetails ? (
                                    <div className="text-red-400 p-6 bg-red-900/20 rounded-xl border border-red-900/50">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="mt-1 flex-shrink-0 text-red-500" size={20} />
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-red-100 mb-1">문법 오류가 발견되었습니다</h3>
                                                    <p className="text-red-300 opacity-90">{errorDetails.message}</p>
                                                </div>

                                                {(errorDetails.line !== undefined) && (
                                                    <div className="bg-black/40 p-3 rounded-lg border border-red-900/30">
                                                        <div className="flex justify-between text-xs text-red-400 mb-2 font-bold uppercase tracking-wider">
                                                            <span>위치 (Position)</span>
                                                            <span>Line {errorDetails.line}, Column {errorDetails.column}</span>
                                                        </div>
                                                        {errorDetails.snippet && (
                                                            <div className="text-sm text-slate-300 break-all overflow-x-auto whitespace-pre">
                                                                {errorDetails.snippet}
                                                                <div className="text-red-500 font-black mt-1">
                                                                    {"^".padStart(errorDetails.column || 1, " ")} <span className="text-xs ml-1">오류 지점</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-xs text-red-400/80 leading-relaxed italic">
                                                    💡 팁: 콤마(,)가 빠졌거나 필요 없는 콤마가 있는지, 혹은 따옴표(")가 제대로 닫혔는지 확인해 보세요.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : json ? (
                                    <ReactJson
                                        src={json}
                                        theme="ocean"
                                        displayDataTypes={false}
                                        style={{ backgroundColor: 'transparent' }}
                                        enableClipboard={false}
                                        collapsed={2}
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
