'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PiggyBank, Calculator, Info, CheckCircle2, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';

interface WeekData {
    week: number;
    deposit: number;
    total: number;
}

interface PinwheelData {
    week: number;
    activeCount: number;
    weeklyTotal: number;
    cumulativeTotal: number;
}

export default function SavingsPage() {
    const [mode, setMode] = useState<'standard' | 'pinwheel'>('standard');
    const [initialAmount, setInitialAmount] = useState<number>(3000);
    const [interestRate, setInterestRate] = useState<number>(3.0);
    const [isTaxFree, setIsTaxFree] = useState<boolean>(false);

    const [weeks, setWeeks] = useState<WeekData[]>([]);
    const [pinwheelWeeks, setPinwheelWeeks] = useState<PinwheelData[]>([]);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [finalPayout, setFinalPayout] = useState<number>(0);

    const AMOUNTS = [1000, 2000, 3000, 5000, 10000];

    useEffect(() => {
        if (mode === 'standard') {
            calculateStandardSavings();
        } else {
            calculatePinwheelSavings();
        }
    }, [mode, initialAmount, interestRate, isTaxFree]);

    const getSingleChallengeInterest = (baseAmount: number, rate: number) => {
        let totalInterest = 0;
        // Standard industry calculation for 26-week savings:
        // Interest = Sum(Deposit * Rate * Days / 365)
        // Days held for W-i: (26 - i + 1) * 7 + 2 (maturity offset)
        for (let i = 1; i <= 26; i++) {
            const deposit = baseAmount * i;
            const daysHeld = (26 - i + 1) * 7 + 2;
            totalInterest += (deposit * (rate / 100) * daysHeld) / 365;
        }
        return Math.floor(totalInterest);
    };

    const calculateStandardSavings = () => {
        const newWeeks: WeekData[] = [];
        let currentPrincipal = 0;

        for (let i = 1; i <= 26; i++) {
            const deposit = initialAmount * i;
            currentPrincipal += deposit;

            newWeeks.push({
                week: i,
                deposit,
                total: currentPrincipal
            });
        }

        const accumulatedInterest = getSingleChallengeInterest(initialAmount, interestRate);
        const taxRate = isTaxFree ? 0 : 0.154;
        const tax = Math.floor(accumulatedInterest * taxRate);
        const finalTax = Math.floor(tax / 10) * 10;

        setWeeks(newWeeks);
        setTotalPrincipal(currentPrincipal);
        setTotalInterest(accumulatedInterest);
        setTaxAmount(finalTax);
        setFinalPayout(currentPrincipal + accumulatedInterest - finalTax);
    };

    const calculatePinwheelSavings = () => {
        const newPinwheelData: PinwheelData[] = [];
        let cumulative = 0;

        for (let currentWeek = 1; currentWeek <= 51; currentWeek++) {
            let weeklyTotal = 0;
            let activeCount = 0;

            for (let challengeStart = 1; challengeStart <= 26; challengeStart++) {
                if (currentWeek >= challengeStart && currentWeek < challengeStart + 26) {
                    const weekOfChallenge = currentWeek - challengeStart + 1;
                    weeklyTotal += initialAmount * weekOfChallenge;
                    activeCount++;
                }
            }

            cumulative += weeklyTotal;
            newPinwheelData.push({
                week: currentWeek,
                activeCount,
                weeklyTotal,
                cumulativeTotal: cumulative
            });
        }

        // Correctly calculate total interest for 26 accounts
        const singleAccountInterest = getSingleChallengeInterest(initialAmount, interestRate);
        const accumulatedInterest = singleAccountInterest * 26;

        const taxRate = isTaxFree ? 0 : 0.154;
        const tax = Math.floor(accumulatedInterest * taxRate);
        const finalTax = Math.floor(tax / 10) * 10;

        setPinwheelWeeks(newPinwheelData);
        setTotalPrincipal(cumulative);
        setTotalInterest(accumulatedInterest);
        setTaxAmount(finalTax);
        setFinalPayout(cumulative + accumulatedInterest - finalTax);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
    };

    const peakWeek = pinwheelWeeks.reduce((max, curr) => curr.weeklyTotal > max.weeklyTotal ? curr : max, { weeklyTotal: 0 } as PinwheelData);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <PiggyBank size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">26주 적금 계산기</h1>
                        <p className="text-slate-500">매주 증액되는 즐거움, 6개월간의 목돈 만들기 도전!</p>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
                            <button
                                onClick={() => setMode('standard')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                일반 모드
                            </button>
                            <button
                                onClick={() => setMode('pinwheel')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'pinwheel' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                풍차돌리기 모드
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Left: Input & Info */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Calculator Input */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Calculator size={18} className="text-blue-500" />
                                    가입 설정
                                </h2>

                                <div className="space-y-6">
                                    {/* Initial Amount Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">최초 가입금액 (변경불가)</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {AMOUNTS.map((amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() => setInitialAmount(amt)}
                                                    className={`py-2 px-1 text-sm rounded-lg border font-medium transition-all ${initialAmount === amt
                                                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {amt >= 10000 ? '1만원' : `${amt / 1000}천원`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interest Rate */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">연 이자율 (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hide-spinner"
                                                step="0.1"
                                            />
                                            <span className="absolute right-4 top-2.5 text-slate-400">%</span>
                                        </div>
                                    </div>

                                    {/* Tax Option */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">세금 우대</label>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => setIsTaxFree(false)}
                                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isTaxFree ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500'}`}
                                            >
                                                일반과세 (15.4%)
                                            </button>
                                            <button
                                                onClick={() => setIsTaxFree(true)}
                                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isTaxFree ? 'bg-white shadow-sm text-blue-600 border border-blue-200' : 'text-slate-500'}`}
                                            >
                                                비과세
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info & Pinwheel Info */}
                            <div className="bg-slate-100 p-6 rounded-2xl">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Info size={16} />
                                    {mode === 'standard' ? '상품 안내' : '풍차돌리기란?'}
                                </h3>
                                {mode === 'standard' ? (
                                    <ul className="text-xs text-slate-500 space-y-2 leading-relaxed list-disc pl-4">
                                        <li><strong>가입대상:</strong> 주민등록증 소지 만 14세 이상 내국인</li>
                                        <li><strong>계약기간:</strong> 6개월 (26주)</li>
                                        <li><strong>납입방법:</strong> 매주 최초 가입금액만큼 자동 증액</li>
                                        <li><strong>이자지급:</strong> 만기일시지급식</li>
                                    </ul>
                                ) : (
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        매주 새로운 26주 적금을 하나씩 개설하여 총 26개의 적금을 중첩해서 들어가는 방식입니다.
                                        26주차에는 매주 신규 가입한 적금과 기존 적금의 증액분이 겹쳐 납입 부담이 가장 커지지만,
                                        그 이후부터는 매주 만기가 돌아와 목돈을 계속 수령하게 됩니다.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right: Summary & Table */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Result Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">총 납입 원금</p>
                                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPrincipal)}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">만기 총 수령액 (세후)</p>
                                    <p className={`text-2xl font-bold ${mode === 'standard' ? 'text-blue-600' : 'text-indigo-600'}`}>{formatCurrency(finalPayout)}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        세전 이자 {formatCurrency(totalInterest)} - 세금 {formatCurrency(taxAmount)}
                                    </p>
                                </div>
                            </div>

                            {/* Pinwheel Specific Stats */}
                            {mode === 'pinwheel' && (
                                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-600 font-bold uppercase">최고 납입 주차 (Peak)</p>
                                            <p className="text-sm text-slate-700 font-medium">제 {peakWeek.week}주차</p>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-xs text-indigo-600 font-bold uppercase">최고 주간 납입액</p>
                                        <p className="text-xl font-black text-indigo-800">{formatCurrency(peakWeek.weeklyTotal)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-700">
                                        {mode === 'standard' ? '주차별 납입 스케줄' : '풍차돌리기 전체 시뮬레이션 (51주)'}
                                    </h3>
                                    {mode === 'pinwheel' && <span className="text-[10px] bg-slate-200 px-2 py-1 rounded-full text-slate-600 font-bold">총 26계좌 운영</span>}
                                </div>
                                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-3">주차</th>
                                                {mode === 'pinwheel' && <th className="px-6 py-3">활성 계좌수</th>}
                                                <th className="px-6 py-3">{mode === 'standard' ? '이번 주 입금액' : '주간 총 납입액'}</th>
                                                <th className="px-6 py-3">누적 원금</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mode === 'standard' ? (
                                                weeks.map((week) => (
                                                    <tr
                                                        key={week.week}
                                                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${week.week === 26 ? 'bg-blue-50/50' : ''}`}
                                                    >
                                                        <td className="px-6 py-3">
                                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${week.week === 26 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                                {week.week}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 font-medium text-slate-900">
                                                            {formatCurrency(week.deposit)}
                                                            {week.week === 1 && <span className="ml-2 text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">시작</span>}
                                                            {week.week === 26 && <span className="ml-2 text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">만기</span>}
                                                        </td>
                                                        <td className="px-6 py-3 text-slate-500">{formatCurrency(week.total)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                pinwheelWeeks.map((pw) => (
                                                    <tr
                                                        key={pw.week}
                                                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${pw.week === peakWeek.week ? 'bg-indigo-50/50' : ''}`}
                                                    >
                                                        <td className="px-6 py-3">
                                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${pw.week === peakWeek.week ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                                {pw.week}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-1">
                                                                <div className="flex gap-0.5">
                                                                    {[...Array(Math.min(5, pw.activeCount))].map((_, i) => (
                                                                        <div key={i} className="w-1 h-3 bg-indigo-400 rounded-full" />
                                                                    ))}
                                                                    {pw.activeCount > 5 && <span className="text-[10px] text-indigo-400">+{pw.activeCount - 5}</span>}
                                                                </div>
                                                                <span className="text-xs text-slate-400 ml-1">({pw.activeCount})</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 font-medium text-slate-900">
                                                            {formatCurrency(pw.weeklyTotal)}
                                                            {pw.week === peakWeek.week && <span className="ml-2 text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">최고</span>}
                                                        </td>
                                                        <td className="px-6 py-3 text-slate-500">{formatCurrency(pw.cumulativeTotal)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
