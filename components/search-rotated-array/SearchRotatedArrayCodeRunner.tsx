'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { SearchRotatedArrayStep } from '@/lib/searchRotatedArraySimulation';

interface SearchRotatedArrayCodeRunnerProps {
  currentStep: SearchRotatedArrayStep;
  totalSteps: number;
}

interface Token {
  text: string;
  color: string;
}

const ALGORITHM_CODE_LINES: { lineNum: number; tokens: Token[] }[] = [
  {
    lineNum: 1,
    tokens: [
      { text: 'function ', color: '#ff7b72' },
      { text: 'search', color: '#d2a8ff' },
      { text: '(nums: ', color: '#c9d1d9' },
      { text: 'number', color: '#79c0ff' },
      { text: '[], target: ', color: '#c9d1d9' },
      { text: 'number', color: '#79c0ff' },
      { text: '): ', color: '#c9d1d9' },
      { text: 'number', color: '#79c0ff' },
      { text: ' {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 2,
    tokens: [
      { text: '  let ', color: '#ff7b72' },
      { text: 'low ', color: '#79c0ff' },
      { text: '= ', color: '#ff7b72' },
      { text: '0', color: '#a5d6ff' },
      { text: ', high ', color: '#79c0ff' },
      { text: '= ', color: '#ff7b72' },
      { text: 'nums.length - ', color: '#c9d1d9' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 3,
    tokens: [
      { text: '  while ', color: '#ff7b72' },
      { text: '(low <= high) {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 4,
    tokens: [
      { text: '    // 1. Calculate mid pointer', color: '#8b949e' },
    ],
  },
  {
    lineNum: 5,
    tokens: [
      { text: '    const ', color: '#ff7b72' },
      { text: 'mid ', color: '#79c0ff' },
      { text: '= Math.floor(low + (high - low) / ', color: '#c9d1d9' },
      { text: '2', color: '#a5d6ff' },
      { text: ');', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 6,
    tokens: [
      { text: '    // 2. Exact match check', color: '#8b949e' },
    ],
  },
  {
    lineNum: 7,
    tokens: [
      { text: '    if ', color: '#ff7b72' },
      { text: '(nums[mid] === target) {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 8,
    tokens: [
      { text: '      return ', color: '#ff7b72' },
      { text: 'mid', color: '#79c0ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 9,
    tokens: [
      { text: '    }', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 10,
    tokens: [
      { text: '    // 3. Check if Left Half is sorted', color: '#8b949e' },
    ],
  },
  {
    lineNum: 11,
    tokens: [
      { text: '    if ', color: '#ff7b72' },
      { text: '(nums[low] <= nums[mid]) {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 12,
    tokens: [
      { text: '      if ', color: '#ff7b72' },
      { text: '(target >= nums[low] && target < nums[mid]) {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 13,
    tokens: [
      { text: '        // Target in left -> eliminate right', color: '#8b949e' },
    ],
  },
  {
    lineNum: 14,
    tokens: [
      { text: '        high = mid - ', color: '#c9d1d9' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 15,
    tokens: [
      { text: '      } else {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 16,
    tokens: [
      { text: '        // Target in right -> eliminate left', color: '#8b949e' },
    ],
  },
  {
    lineNum: 17,
    tokens: [
      { text: '        low = mid + ', color: '#c9d1d9' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 18,
    tokens: [
      { text: '      }', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 19,
    tokens: [
      { text: '    } else {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 20,
    tokens: [
      { text: '      // 4. Right Half MUST be sorted', color: '#8b949e' },
    ],
  },
  {
    lineNum: 21,
    tokens: [
      { text: '      if ', color: '#ff7b72' },
      { text: '(target > nums[mid] && target <= nums[high]) {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 22,
    tokens: [
      { text: '        // Target in right -> eliminate left', color: '#8b949e' },
    ],
  },
  {
    lineNum: 23,
    tokens: [
      { text: '        low = mid + ', color: '#c9d1d9' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 24,
    tokens: [
      { text: '      } else {', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 25,
    tokens: [
      { text: '        // Target in left -> eliminate right', color: '#8b949e' },
    ],
  },
  {
    lineNum: 26,
    tokens: [
      { text: '        high = mid - ', color: '#c9d1d9' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 27,
    tokens: [
      { text: '      }', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 28,
    tokens: [
      { text: '    }', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 29,
    tokens: [
      { text: '  }', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 30,
    tokens: [
      { text: '  // 5. Target not found in array', color: '#8b949e' },
    ],
  },
  {
    lineNum: 31,
    tokens: [
      { text: '  return -', color: '#ff7b72' },
      { text: '1', color: '#a5d6ff' },
      { text: ';', color: '#c9d1d9' },
    ],
  },
  {
    lineNum: 32,
    tokens: [
      { text: '}', color: '#c9d1d9' },
    ],
  },
];

export function SearchRotatedArrayCodeRunner({
  currentStep,
  totalSteps,
}: SearchRotatedArrayCodeRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll active line to vertical midpoint
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (containerRef.current && activeLineRef.current) {
        const container = containerRef.current;
        const line = activeLineRef.current;
        const targetOffset =
          line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2;
        container.scrollTop = Math.max(0, targetOffset);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [currentStep.highlightedLine]);

  const handleCopyCode = () => {
    const rawCode = ALGORITHM_CODE_LINES.map((l) =>
      l.tokens.map((t) => t.text).join('')
    ).join('\n');
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#070a14] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="font-bold text-slate-200">
            TYPESCRIPT ALGORITHM RUNNER
          </span>
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
            SHIKI TOKYO-NIGHT
          </span>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-0.5 text-xs text-slate-300 relative select-text"
        style={{ scrollBehavior: 'auto' }}
      >
        {ALGORITHM_CODE_LINES.map(({ lineNum, tokens }) => {
          const isActive = currentStep.highlightedLine === lineNum;
          return (
            <div
              key={lineNum}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center rounded px-2 py-1 transition-colors ${
                isActive
                  ? 'bg-sky-500/25 border-l-2 border-sky-400 shadow-lg text-white font-bold'
                  : 'hover:bg-slate-900/40 text-slate-400'
              }`}
            >
              <span className="w-8 text-[11px] text-slate-600 select-none text-right pr-3 shrink-0">
                {lineNum}
              </span>
              <div className="flex-1 whitespace-pre">
                {tokens.map((token, idx) => (
                  <span
                    key={idx}
                    style={{ color: isActive ? '#ffffff' : token.color }}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-800 bg-[#070a14] flex items-center justify-between text-[11px] text-slate-400">
        <span>Line {currentStep.highlightedLine}: {currentStep.actionTitle}</span>
        <span>Step {currentStep.stepNumber} / {totalSteps}</span>
      </div>
    </div>
  );
}
