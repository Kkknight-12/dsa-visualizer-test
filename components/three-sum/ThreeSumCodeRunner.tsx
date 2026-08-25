'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Target } from 'lucide-react';
import { ThreeSumStep, THREE_SUM_CODE_SNIPPET } from '@/lib/threeSumSimulation';
import { codeToTokens } from 'shiki';

interface ThreeSumCodeRunnerProps {
  currentStep: ThreeSumStep;
  totalSteps: number;
}

interface Token {
  content: string;
  color?: string;
  fontStyle?: number;
}

export function ThreeSumCodeRunner({ currentStep, totalSteps }: ThreeSumCodeRunnerProps) {
  const [tokenizedLines, setTokenizedLines] = useState<Token[][]>([]);
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const codeContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    codeToTokens(THREE_SUM_CODE_SNIPPET, {
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
    navigator.clipboard.writeText(THREE_SUM_CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeLine = currentStep?.activeLine ?? 1;
  const stepNumber = currentStep?.stepNumber ?? 1;

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
  }, [activeLine, stepNumber, tokenizedLines]);

  const rawLines = THREE_SUM_CODE_SNIPPET.split('\n');

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-sm overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              TypeScript Algorithm Runner
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                Shiki Tokyo-Night
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans flex items-center gap-1.5 mt-0.5">
              <Target className="w-3.5 h-3.5 text-sky-400" />
              <span>Clean IDE view with smooth active line auto-focus</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* 2. Shiki Code Container with Official Theme Background */}
      <div
        ref={codeContainerRef}
        className="w-full max-h-[380px] overflow-y-auto pr-2 my-2 space-y-0.5 rounded-xl bg-[#16161e] p-3 border border-slate-800/90 scrollbar-thin scrollbar-thumb-slate-800 select-text"
      >
        {rawLines.map((lineText, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;
          const tokens = tokenizedLines[index];

          return (
            <div
              key={lineNumber}
              ref={isActive ? activeLineRef : null}
              className={`relative flex items-center justify-between min-w-max px-2.5 py-[3px] rounded transition-all duration-200 ${
                isActive
                  ? 'bg-sky-500/25 border-l-4 border-sky-400 shadow-xl shadow-sky-500/20 ring-1 ring-sky-500/40'
                  : 'hover:bg-slate-900/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center font-mono">
                {/* Gutter Line Number + Active Laser Pointer Icon */}
                <span className="w-8 shrink-0 select-none text-xs text-right pr-2.5 flex items-center justify-end gap-1">
                  {isActive ? (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-sky-400 font-bold text-xs"
                    >
                      ▶
                    </motion.span>
                  ) : null}
                  <span className={isActive ? 'text-sky-300 font-extrabold' : 'text-slate-600'}>
                    {lineNumber}
                  </span>
                </span>

                {/* Tokenized Shiki Colored Line */}
                <span className="whitespace-pre text-xs sm:text-sm leading-relaxed font-mono font-medium">
                  {tokens && tokens.length > 0 ? (
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
                    <span className="text-[#c0caf5]">{lineText}</span>
                  )}
                </span>
              </div>

              {isActive && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500 text-slate-950 font-black uppercase tracking-wider shrink-0 ml-3">
                  ACTIVE
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
