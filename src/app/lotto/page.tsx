'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Clover, RotateCw, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LottoPage() {
    const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
    const [history, setHistory] = useState<number[][]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateLotto = () => {
        setIsGenerating(true);

        // Simulate thinking/rolling time
        setTimeout(() => {
            const numbers = new Set<number>();
            while (numbers.size < 6) {
                numbers.add(Math.floor(Math.random() * 45) + 1);
            }
            const sorted = Array.from(numbers).sort((a, b) => a - b);

            setCurrentNumbers(sorted);
            setHistory(prev => [sorted, ...prev].slice(0, 10)); // Keep last 10
            setIsGenerating(false);
        }, 600);
    };

    const getBallColor = (num: number) => {
        if (num <= 10) return 'bg-yellow-400 text-yellow-900 border-yellow-500'; // 1-10
        if (num <= 20) return 'bg-blue-500 text-white border-blue-600'; // 11-20
        if (num <= 30) return 'bg-red-500 text-white border-red-600'; // 21-30
        if (num <= 40) return 'bg-slate-500 text-white border-slate-600'; // 31-40
        return 'bg-green-500 text-white border-green-600'; // 41-45
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 shadow-sm">
                            <Clover size={40} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">로또 번호 추출기</h1>
                    <p className="text-slate-500 mb-12">행운의 번호를 확인해보세요.</p>

                    {/* Ball Display */}
                    <div className="min-h-[120px] mb-12 flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                        <AnimatePresence mode='wait'>
                            {currentNumbers.length > 0 ? (
                                currentNumbers.map((num, idx) => (
                                    <motion.div
                                        key={`${num}-${idx}`}
                                        initial={{ scale: 0, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                            delay: idx * 0.1
                                        }}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold shadow-lg border-b-4 ${getBallColor(num)}`}
                                    >
                                        {num}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-slate-300 font-medium text-lg">
                                    버튼을 눌러 번호를 생성하세요
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={generateLotto}
                        disabled={isGenerating}
                        className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <RotateCw className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        {isGenerating ? '번호 추출 중...' : '번호 추출하기'}
                    </button>

                    {/* History Section */}
                    {history.length > 0 && (
                        <div className="mt-16 text-left max-w-lg mx-auto">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <History size={16} /> 최근 생성 기록
                            </h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
                                {history.map((set, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-50 last:border-0 rounded-lg hover:bg-slate-50 transition-colors">
                                        <span className="text-xs font-mono text-slate-400">#{history.length - idx}</span>
                                        <div className="flex gap-2">
                                            {set.map(n => (
                                                <span key={n} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getBallColor(n)}`}>
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
