'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Sparkles, Target } from 'lucide-react';
import { TrappingWaterStep } from '@/lib/trappingWaterSimulation';
import { codeToTokens } from 'shiki';

interface TrappingWaterCodeRunnerProps {
  currentStep: TrappingWaterStep;
  totalSteps: number;
}

const RAW_CODE = `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left <= right) {
    // 1. Shorter wall is on left side
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      // 2. Shorter wall is on right side
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}`;

interface Token {
  content: string;
  color?: string;
  fontStyle?: number;
}

export function TrappingWaterCodeRunner({
  currentStep,
  totalSteps,
}: TrappingWaterCodeRunnerProps) {
  const [tokenizedLines, setTokenizedLines] = useState<Token[][]>([]);
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const codeContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    codeToTokens(RAW_CODE, {
      lang: 'typescript',
      theme: 'tokyo-night',
    }).then(({ tokens }) => {
      if (isMounted) {
        setTokenizedLines(tokens);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeLine = currentStep.activeLine;

  // Auto-scroll active line to vertical midpoint inside requestAnimationFrame
  useEffect(() => {
    const scrollToActive = () => {
      if (activeLineRef.current && codeContainerRef.current) {
        const container = codeContainerRef.current;
        const element = activeLineRef.current;

        const targetScrollTop =
          element.offsetTop - container.clientHeight / 2 + element.clientHeight / 2;

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth',
        });
      }
    };

    const frameId = requestAnimationFrame(scrollToActive);
    return () => cancelAnimationFrame(frameId);
  }, [activeLine, currentStep.stepNumber, tokenizedLines]);

  const rawLines = RAW_CODE.split('\n');

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              TypeScript Algorithm Runner
              <span className="text-[9px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                Shiki Tokyo-Night
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
              <Target className="w-3 h-3 text-sky-400" />
              <span>Clean IDE view with smooth active line auto-focus</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* 2. Code Body with Shiki Tokens */}
      <div
        ref={codeContainerRef}
        className="relative flex-1 overflow-x-auto overflow-y-auto max-h-[360px] min-h-[300px] bg-[#16161e] p-3 rounded-xl border border-slate-800/90 space-y-0.5 select-text"
      >
        {rawLines.map((rawText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = lineNum === activeLine;
          const tokens = tokenizedLines[idx];

          return (
            <div
              key={lineNum}
              ref={isHighlighted ? activeLineRef : null}
              className={`relative flex items-center justify-between min-w-max px-2 py-[2.5px] rounded transition-all duration-200 ${
                isHighlighted
                  ? 'bg-sky-500/25 border-l-4 border-sky-400 shadow-xl shadow-sky-500/20 ring-1 ring-sky-500/40'
                  : 'hover:bg-slate-900/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center font-mono">
                {/* Gutter Line Number + Active Laser Pointer */}
                <span className="w-8 shrink-0 select-none text-[10px] text-right pr-2 flex items-center justify-end gap-1">
                  {isHighlighted ? (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-sky-400 font-bold text-xs"
                    >
                      ▶
                    </motion.span>
                  ) : null}
                  <span className={isHighlighted ? 'text-sky-300 font-bold' : 'text-slate-600'}>
                    {lineNum}
                  </span>
                </span>

                {/* Tokenized Shiki Colored Line */}
                <span className="whitespace-pre text-xs leading-relaxed font-mono">
                  {tokens ? (
                    tokens.map((tok, tIdx) => (
                      <span
                        key={tIdx}
                        style={{ color: tok.color || '#c0caf5' }}
                        className={tok.fontStyle === 1 ? 'italic' : ''}
                      >
                        {tok.content}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-300">{rawText}</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Action Narration Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            Line {activeLine}: <strong className="text-sky-300">{currentStep.actionTitle}</strong>
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono shrink-0 pl-2">
          Step {currentStep.stepNumber} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
