'use client';

import React, { useState, useMemo, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Regex, AlertCircle, HelpCircle } from 'lucide-react';

/** 라벨 옆 물음표에 마우스를 올리면 설명을 보여주는 툴팁 */
function Tooltip({
  content,
  children,
  contentClassName = '',
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <span className="relative inline-flex items-center gap-1.5 group/tip">
      {children}
      <span className="inline-flex text-slate-400 hover:text-sky-600 cursor-help">
        <HelpCircle size={14} />
      </span>
      <span
        className={`absolute left-0 top-full mt-1 z-10 px-3 py-2 text-xs text-slate-600 bg-slate-800 text-white rounded-lg shadow-lg whitespace-normal max-w-[280px] opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-opacity pointer-events-none ${contentClassName}`}
      >
        {content}
      </span>
    </span>
  );
}

const FLAG_DESC: Record<string, string> = {
  g: '전역 검색: 문자열 전체에서 모든 매치를 찾습니다.',
  i: '대소문자 무시: 영문 대소문자를 구분하지 않습니다.',
  m: '여러 줄: ^와 $가 각 줄의 시작/끝에 매치됩니다.',
};

const PATTERN_PRESETS: { name: string; pattern: string; desc: string }[] = [
  { name: '이메일', pattern: '\\w+@\\w+\\.\\w+', desc: '기본 이메일 형식' },
  { name: '숫자만', pattern: '\\d+', desc: '연속된 숫자' },
  { name: '전화번호', pattern: '\\d{2,3}-\\d{3,4}-\\d{4}', desc: '010-1234-5678 형식' },
  { name: 'URL', pattern: 'https?://\\S+', desc: 'http/https 링크' },
  { name: '한글', pattern: '[가-힣]+', desc: '한글 단어' },
  { name: '공백', pattern: '\\s+', desc: '공백/탭/줄바꿈' },
  { name: '단어', pattern: '\\w+', desc: '영문·숫자·언더스코어' },
  { name: '정수', pattern: '-?\\d+', desc: '음수 포함 정수' },
  { name: '소수', pattern: '\\d+\\.\\d+', desc: '소수점 숫자' },
  { name: '괄호 안', pattern: '\\([^)]*\\)', desc: '( ) 안의 내용' },
  { name: 'HTML 태그', pattern: '<[^>]+>', desc: '<div> 같은 태그' },
  { name: '공백 제거용', pattern: '^\\s+|\\s+$', desc: '앞뒤 공백' },
];

interface MatchResult {
  full: string;
  index: number;
  groups: string[];
}

function getMatches(patternStr: string, flags: string, text: string): { error: string | null; matches: MatchResult[] } {
  if (!patternStr.trim()) return { error: null, matches: [] };
  try {
    const regex = new RegExp(patternStr, flags);
    const matches: MatchResult[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    while ((m = re.exec(text)) !== null) {
      matches.push({
        full: m[0],
        index: m.index,
        groups: m.slice(1),
      });
      if (matches.length > 500) break;
    }
    return { error: null, matches };
  } catch (e) {
    return { error: (e as Error).message, matches: [] };
  }
}

function highlightMatches(text: string, patternStr: string, flags: string): React.ReactNode[] {
  if (!patternStr.trim()) return [text];
  try {
    const regex = new RegExp(patternStr, flags);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    let m: RegExpExecArray | null;
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    while ((m = re.exec(text)) !== null) {
      if (m.index > lastIndex) {
        parts.push(<span key={key++}>{text.slice(lastIndex, m.index)}</span>);
      }
      parts.push(
        <mark key={key++} className="bg-amber-200 text-slate-900 rounded px-0.5">
          {m[0]}
        </mark>
      );
      lastIndex = m.index + m[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }
    return parts.length ? parts : [text];
  } catch {
    return [text];
  }
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello world 123. Test 456.\nfoo@example.com and bar@test.org');
  const patternInputRef = useRef<HTMLInputElement>(null);

  const insertPattern = (presetPattern: string) => {
    const input = patternInputRef.current;
    if (input) {
      const start = input.selectionStart ?? pattern.length;
      const end = input.selectionEnd ?? pattern.length;
      const next = pattern.slice(0, start) + presetPattern + pattern.slice(end);
      setPattern(next);
      setTimeout(() => {
        input.focus();
        const pos = start + presetPattern.length;
        input.setSelectionRange(pos, pos);
      }, 0);
    } else {
      setPattern((prev) => prev + presetPattern);
    }
  };

  const { error, matches } = useMemo(
    () => getMatches(pattern, flags, text),
    [pattern, flags, text]
  );

  const highlighted = useMemo(
    () => highlightMatches(text, pattern, flags),
    [text, pattern, flags]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
              <Regex size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">정규식 테스터</h1>
              <p className="text-slate-500 text-sm mb-1">패턴과 테스트 문자열로 매치 결과를 확인하고 하이라이트할 수 있습니다.</p>
              <p className="text-slate-400 text-xs">
                각 항목 옆 <HelpCircle className="inline w-3.5 h-3.5 align-middle text-slate-400" /> 아이콘에 마우스를 올리면 설명이 나옵니다.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div>
              <Tooltip content="원하는 조건을 클릭하면 위쪽 패턴 입력란에 삽입됩니다. 여러 개 조합해서 사용할 수 있어요.">
                <span className="block text-sm font-medium text-slate-700 mb-2">패턴 조건 (클릭하여 추가)</span>
              </Tooltip>
              <div className="flex flex-wrap gap-2">
                {PATTERN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => insertPattern(preset.pattern)}
                    title={preset.desc}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-sky-100 hover:text-sky-800 border border-transparent hover:border-sky-200 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Tooltip content="매칭할 규칙을 정규식으로 적어주세요. 예: \\d+ 는 숫자 한 덩어리, \\w+ 는 단어 한 덩어리를 의미합니다.">
                <label className="block text-sm font-medium text-slate-700 mb-2">정규식 패턴</label>
              </Tooltip>
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  ref={patternInputRef}
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm"
                  placeholder="예: \\w+@\\w+\\.\\w+"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <Tooltip contentClassName="min-w-[320px] max-w-[380px]" content={<>g: {FLAG_DESC.g}<br />i: {FLAG_DESC.i}<br />m: {FLAG_DESC.m}</>}>
                    <span className="text-sm text-slate-500">플래그:</span>
                  </Tooltip>
                  {['g', 'i', 'm'].map((f) => (
                    <label key={f} className="flex items-center gap-1 cursor-pointer" title={FLAG_DESC[f]}>
                      <input
                        type="checkbox"
                        checked={flags.includes(f)}
                        onChange={(e) => {
                          if (e.target.checked) setFlags((prev) => [...prev, f].sort().join(''));
                          else setFlags((prev) => prev.replace(f, ''));
                        }}
                        className="w-4 h-4 rounded text-slate-900"
                      />
                      <span className="text-sm font-mono">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>

            <div>
              <Tooltip content="여기에 위 패턴이 매칭되는지 확인하고 싶은 텍스트를 넣어주세요. 결과는 아래에서 하이라이트로 보입니다.">
                <label className="block text-sm font-medium text-slate-700 mb-2">테스트 문자열</label>
              </Tooltip>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y"
                placeholder="매칭할 텍스트"
              />
            </div>

            {pattern.trim() && !error && (
              <>
                <div>
                  <Tooltip content="테스트 문자열에서 패턴에 맞는 부분이 노란색으로 표시됩니다. 한눈에 어디가 매칭됐는지 확인할 수 있어요.">
                    <label className="block text-sm font-medium text-slate-700 mb-2">하이라이트 결과</label>
                  </Tooltip>
                  <div className="px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm bg-slate-50 min-h-[4rem] whitespace-pre-wrap break-words">
                    {highlighted}
                  </div>
                </div>
                <div>
                  <Tooltip content="패턴에 매칭된 텍스트를 하나씩 나열합니다. 괄호 () 로 묶은 부분은 '그룹'으로 따로 표시됩니다.">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      매치 결과 ({matches.length}건)
                    </label>
                  </Tooltip>
                  {matches.length === 0 ? (
                    <p className="text-slate-500 text-sm">매칭된 결과가 없습니다.</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {matches.slice(0, 100).map((m, i) => (
                        <li key={i} className="flex flex-wrap items-baseline gap-2 text-sm">
                          <span className="text-slate-500 font-mono">#{i + 1}</span>
                          <code className="px-2 py-1 bg-amber-100 rounded">{m.full}</code>
                          <span className="text-slate-400">위치 {m.index}</span>
                          {m.groups.filter(Boolean).length > 0 && (
                            <span className="text-slate-500">그룹: [{m.groups.join(', ')}]</span>
                          )}
                        </li>
                      ))}
                      {matches.length > 100 && (
                        <li className="text-slate-500 text-sm">… 외 {matches.length - 100}건</li>
                      )}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
