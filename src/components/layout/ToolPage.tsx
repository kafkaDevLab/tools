'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ToolPage({
  title,
  description,
  children,
  note,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="w-full max-w-4xl mx-auto flex-grow px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-slate-600 mb-8">{description}</p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-6">
          {children}
        </div>
        {note && <p className="mt-5 text-sm text-slate-500">{note}</p>}
      </main>
      <Footer />
    </div>
  );
}
