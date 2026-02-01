'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DollarSign, TrendingUp, Wallet, PieChart } from 'lucide-react';

export default function DividendPage() {
    const [sharePrice, setSharePrice] = useState<string>('10000');
    const [sharesOwned, setSharesOwned] = useState<string>('100');
    // Mode: 'yield' (percentage) or 'amount' (cash value per share)
    const [calcMode, setCalcMode] = useState<'yield' | 'amount'>('yield');
    const [dividendYield, setDividendYield] = useState<string>('3.5');
    const [dividendAmount, setDividendAmount] = useState<string>('350');

    const [annualIncome, setAnnualIncome] = useState<number>(0);
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

    useEffect(() => {
        const price = parseFloat(sharePrice) || 0;
        const shares = parseFloat(sharesOwned) || 0;

        let total = 0;

        if (calcMode === 'yield') {
            const yieldPercent = parseFloat(dividendYield) || 0;
            // Total = (Price * Shares) * (Yield / 100)
            total = (price * shares) * (yieldPercent / 100);
        } else {
            const amount = parseFloat(dividendAmount) || 0;
            // Total = Shares * Amount per share
            total = shares * amount;
        }

        setAnnualIncome(total);
        setMonthlyIncome(total / 12);
    }, [sharePrice, sharesOwned, calcMode, dividendYield, dividendAmount]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto mb-4 flex justify-center">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 shrink-0 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <TrendingUp size={24} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold mb-1 text-slate-900">배당금 계산기</h1>
                            <p className="text-slate-500 text-sm">보유 주식의 예상 배당 수익을 계산해보세요.</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                                <Wallet className="text-purple-500" size={20} />
                                투자 정보 입력
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            주당 가격
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400">₩</span>
                                            <input
                                                type="number"
                                                value={sharePrice}
                                                onChange={(e) => setSharePrice(e.target.value)}
                                                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hide-spinner"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                            보유 수량 (주)
                                        </label>
                                        <input
                                            type="number"
                                            value={sharesOwned}
                                            onChange={(e) => setSharesOwned(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hide-spinner"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">배당 기준</label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                                        <button
                                            onClick={() => setCalcMode('yield')}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${calcMode === 'yield' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            배당률 (%)
                                        </button>
                                        <button
                                            onClick={() => setCalcMode('amount')}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${calcMode === 'amount' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            주당 배당금 (원)
                                        </button>
                                    </div>

                                    {calcMode === 'yield' ? (
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={dividendYield}
                                                onChange={(e) => setDividendYield(e.target.value)}
                                                className="w-full pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hide-spinner"
                                                step="0.01"
                                            />
                                            <span className="absolute right-3 top-2.5 text-slate-400">%</span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400">₩</span>
                                            <input
                                                type="number"
                                                value={dividendAmount}
                                                onChange={(e) => setDividendAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hide-spinner"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Result Card */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-6">
                                    <PieChart size={20} />
                                    <span className="text-sm font-medium uppercase tracking-wider">예상 수익금</span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-slate-400 text-sm mb-1">연간 총 배당금</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{formatCurrency(annualIncome)}</span>
                                        <span className="text-lg">원</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-slate-400 text-sm mb-1">월 환산 금액</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-semibold text-purple-300">{formatCurrency(monthlyIncome)}</span>
                                        <span className="text-sm text-purple-300">원</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl">
                                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <DollarSign size={16} className="text-purple-600" /> 투자 팁
                                </h4>
                                <p className="text-sm text-purple-800 leading-relaxed">
                                    배당금은 일반적으로 15.4%의 배당소득세가 원천징수된 후 입금됩니다.
                                    <br />
                                    위 계산 결과는 <strong>세전 기준</strong>이므로, 실제 수령액은 약 <strong>{formatCurrency(annualIncome * 0.846)}원</strong> (세후) 입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
