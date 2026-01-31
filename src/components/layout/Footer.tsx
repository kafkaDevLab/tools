'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black text-slate-900 mb-1">
              Daily<span className="text-blue-600">Tools</span>
            </h4>
            <p className="text-sm text-slate-500">
              © 2024 Daily Tools. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">
              개인정보처리방침
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">
              이용약관
            </a>
            <a href="mailto:contact@example.com" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
