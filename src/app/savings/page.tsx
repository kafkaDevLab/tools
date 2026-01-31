'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PiggyBank, Calculator, Info, CheckCircle2 } from 'lucide-react';

interface WeekData {
    week: number;
    deposit: number;
    total: number;
}

export default function SavingsPage() {
    const [initialAmount, setInitialAmount] = useState<number>(3000);
    const [interestRate, setInterestRate] = useState<number>(3.0); // Default 3%
    const [isTaxFree, setIsTaxFree] = useState<boolean>(false);

    const [weeks, setWeeks] = useState<WeekData[]>([]);
    const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [finalPayout, setFinalPayout] = useState<number>(0);

    // Allowed initial amounts
    const AMOUNTS = [1000, 2000, 3000, 5000, 10000];

    useEffect(() => {
        calculateSavings();
    }, [initialAmount, interestRate, isTaxFree]);

    const calculateSavings = () => {
        const newWeeks: WeekData[] = [];
        let currentPrincipal = 0;
        let accumulatedInterest = 0;

        // 26 weeks iteration
        for (let i = 1; i <= 26; i++) {
            // Validation: Logic is strictly "Initial Amount * Week Number"
            // Week 1: 1 * A
            // Week 2: 2 * A
            // ...
            const deposit = initialAmount * i; // Does "Increase by initial amount" mean incremental? 
            // Guide says: "Example: 1k -> Week 2 2k, Week 3 3k... Week 26 26k"
            // Yes, the deposit amount for week i is i * initialAmount.

            currentPrincipal += deposit;

            // Simple Interest Calculation Estimate
            // Deposit i stays for (26 - i + 1) weeks roughly. 
            // 26 weeks is approx 6 months (182 days).
            // Let's approximate weeks/52 for annual rate ratio.
            const weeksRemaining = 26 - i + 0.5; // Average days? usually simply (total days - deposit date)/365
            // Let's use standard weekly approximation: Interest = Deposit * Rate * (RemainingWeeks / 52)
            const interestForDeposit = Math.floor(deposit * (interestRate / 100) * (weeksRemaining / 52));

            accumulatedInterest += interestForDeposit;

            newWeeks.push({
                week: i,
                deposit,
                total: currentPrincipal
            });
        }

        // Tax Calculation
        // Normal: 15.4% (Income Tax 14% + Local Income Tax 1.4%)
        // Tax-Free: 0%
        const taxRate = isTaxFree ? 0 : 0.154;
        const tax = Math.floor(accumulatedInterest * taxRate);
        // Cut off last digit for KRW tax usually? Banks do floor(tax / 10) * 10. Let's keep simple floor.
        const finalTax = Math.floor(tax / 10) * 10; // Floor to 10 won

        setWeeks(newWeeks);
        setTotalPrincipal(currentPrincipal);
        setTotalInterest(accumulatedInterest);
        setTaxAmount(finalTax);
        setFinalPayout(currentPrincipal + accumulatedInterest - finalTax);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
    };

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
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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

                            {/* Product Info Accordion/Card */}
                            <div className="bg-slate-100 p-6 rounded-2xl">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Info size={16} /> 상품 안내
                                </h3>
                                <ul className="text-xs text-slate-500 space-y-2 leading-relaxed list-disc pl-4">
                                    <li><strong>가입대상:</strong> 주민등록증/운전면허증 소지 만 14세 이상 내국인 (1인당 30계좌)</li>
                                    <li><strong>계약기간:</strong> 6개월 (26주)</li>
                                    <li><strong>납입방법:</strong> 매주 최초 가입금액만큼 자동 증액되어 자동이체</li>
                                    <li><strong>이자지급:</strong> 만기일시지급식</li>
                                    <li><strong>예금종류:</strong> 정기적금 (자유적립식)</li>
                                </ul>
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
                                    <p className="text-sm text-slate-500 mb-1">만기 예상 수령액 (세후)</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(finalPayout)}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        세전 이자 {formatCurrency(totalInterest)} - 세금 {formatCurrency(taxAmount)}
                                    </p>
                                </div>
                            </div>

                            {/* Schedule Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <h3 className="font-semibold text-slate-700">주차별 납입 스케줄</h3>
                                </div>
                                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3">주차</th>
                                                <th className="px-6 py-3">이번 주 입금액</th>
                                                <th className="px-6 py-3">누적 원금</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {weeks.map((week) => (
                                                <tr
                                                    key={week.week}
                                                    className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${week.week === 26 ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <td className="px-6 py-3 flex items-center gap-2">
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
                                            ))}
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
