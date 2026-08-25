'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Sparkles, Target } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';
import { codeToTokens } from 'shiki';

interface ShikiCodeRunnerProps {
  currentStep: TreeStepState;
  totalSteps: number;
}

const RAW_CODE = `function postorderTraversal(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const stack: TraversalFrame[] = [{ node: root, phase: 'expand' }];

  while (stack.length > 0) {
    const frame = stack.pop()!;
    const current = frame.node;

    if (frame.phase === 'visit') {
      result.push(current.val);
      continue;
    }

    // Reverse LIFO Scheduling: ROOT -> RIGHT -> LEFT
    stack.push({ node: current, phase: 'visit' });

    if (current.right !== null) {
      stack.push({ node: current.right, phase: 'expand' });
    }

    if (current.left !== null) {
      stack.push({ node: current.left, phase: 'expand' });
    }
  }

  return result;
}`;

interface Token {
  content: string;
  color?: string;
  fontStyle?: number;
}

export function ShikiCodeRunner({ currentStep, totalSteps }: ShikiCodeRunnerProps) {
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
  const f = currentStep.poppedFrame;

  // Auto-scroll active line to vertical midpoint inside requestAnimationFrame
  useEffect(() => {
    const scrollToActive = () => {
      if (activeLineRef.current && codeContainerRef.current) {
        const container = codeContainerRef.current;
        const element = activeLineRef.current;

        const targetScrollTop =
          element.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth',
        });
      }
    };

    const frameId = requestAnimationFrame(scrollToActive);
    return () => cancelAnimationFrame(frameId);
  }, [activeLine, currentStep.stepNumber, tokenizedLines]);

  const getDynamicAnnotation = (lineNum: number) => {
    if (lineNum !== activeLine) return null;
    switch (lineNum) {
      case 4:
        return "// stack = [{ node: root, phase: 'expand' }]";
      case 7:
        return f ? `// frame = { node: Node(${f.node.val}), phase: '${f.phase}' }` : null;
      case 11:
        return f ? `// result.push(${f.node.val}) → [${currentStep.resultSnapshot.join(', ')}]` : null;
      case 16:
        return f ? `// visit marker Node(${f.node.val}) (Runs LAST)` : null;
      case 19:
        return '// right child (Runs 2nd)';
      case 23:
        return '// left child to TOP (Runs FIRST!)';
      case 27:
        return `// return [${currentStep.resultSnapshot.join(', ')}]`;
      default:
        return `// stack.length = ${currentStep.stackSnapshot.length}`;
    }
  };

  const rawLines = RAW_CODE.split('\n');

  return (
    <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-sm overflow-hidden">
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

      {/* 2. Code Body with Shiki Tokens */}
      <div
        ref={codeContainerRef}
        className="relative flex-1 overflow-x-auto overflow-y-auto max-h-[420px] min-h-[320px] bg-[#16161e] p-3.5 rounded-xl border border-slate-800/90 space-y-0.5 select-text"
      >
        {rawLines.map((rawText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = lineNum === activeLine;
          const tokens = tokenizedLines[idx];
          const annotation = getDynamicAnnotation(lineNum);

          return (
            <div
              key={lineNum}
              ref={isHighlighted ? activeLineRef : null}
              className={`relative flex items-center justify-between min-w-max px-2.5 py-[3px] rounded transition-all duration-200 ${
                isHighlighted
                  ? 'bg-sky-500/25 border-l-4 border-sky-400 shadow-xl shadow-sky-500/20 ring-1 ring-sky-500/40'
                  : 'hover:bg-slate-900/40 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center font-mono">
                {/* Gutter Line Number + Active Laser Pointer Icon */}
                <span className="w-9 shrink-0 select-none text-xs text-right pr-2.5 flex items-center justify-end gap-1">
                  {isHighlighted ? (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-sky-400 font-bold text-sm"
                    >
                      ▶
                    </motion.span>
                  ) : null}
                  <span className={isHighlighted ? 'text-sky-300 font-extrabold' : 'text-slate-500'}>
                    {lineNum}
                  </span>
                </span>

                {/* Tokenized Shiki Colored Line */}
                <span className="whitespace-pre text-xs sm:text-sm leading-relaxed font-mono font-medium">
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

              {/* Dynamic Inline Annotation Badge */}
              {annotation && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-mono text-amber-300 font-bold italic pl-4 shrink-0"
                >
                  {annotation}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Footer Line Indicator */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 truncate font-mono">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">
            Active Line <strong className="text-sky-300 font-bold">{activeLine}</strong>
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono shrink-0 pl-2">
          Step <strong className="text-sky-300 font-bold">{currentStep.stepNumber}</strong> / {totalSteps}
        </span>
      </div>
    </div>
  );
}
