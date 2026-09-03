'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { SearchRotatedArrayStep } from '@/lib/searchRotatedArraySimulation';

interface SearchRotatedArrayCodeRunnerProps {
  currentStep: SearchRotatedArrayStep;
  totalSteps: number;
  className?: string;
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
  className,
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
    <div
      className={`w-full h-full lg:absolute lg:inset-0 bg-[#0a0d16] border border-slate-800/80 rounded-2xl flex flex-col shadow-xl overflow-hidden font-mono ${
        className || ''
      }`}
    >
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#080b14] flex items-center justify-between text-xs sm:text-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-sky-400" />
          </div>
          <span className="font-bold text-slate-200">
            TYPESCRIPT ALGORITHM RUNNER
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
            SHIKI TOKYO-NIGHT
          </span>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer Container with min-h-0 to enable internal scrolling inside flex container */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 space-y-1 text-xs sm:text-sm text-slate-200 relative select-text"
        style={{ scrollBehavior: 'auto' }}
      >
        {ALGORITHM_CODE_LINES.map(({ lineNum, tokens }) => {
          const isActive = currentStep.highlightedLine === lineNum;
          return (
            <div
              key={lineNum}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center rounded-lg px-2.5 py-1.5 transition-colors ${
                isActive
                  ? 'bg-sky-500/20 border-l-2 border-sky-400 text-white font-bold'
                  : 'hover:bg-slate-900/40 text-slate-300'
              }`}
            >
              <span className="w-9 text-xs text-slate-500 select-none text-right pr-3.5 shrink-0">
                {lineNum}
              </span>
              <div className="flex-1 whitespace-pre leading-relaxed">
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
      <div className="px-5 py-2.5 border-t border-slate-800/80 bg-[#080b14] flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 shrink-0">
        <span>Line {currentStep.highlightedLine}: {currentStep.actionTitle}</span>
        <span>Step {currentStep.stepNumber} / {totalSteps}</span>
      </div>
    </div>
  );
}
