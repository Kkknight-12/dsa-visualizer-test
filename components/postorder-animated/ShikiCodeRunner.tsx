'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Sparkles } from 'lucide-react';
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

  const getActiveLineNumber = () => {
    switch (currentStep.actionType) {
      case 'init':
        return 4;
      case 'pop':
        return 7;
      case 'visit':
        return 11;
      case 'push_visit':
        return 16;
      case 'push_right':
        return 19;
      case 'push_left':
        return 23;
      case 'complete':
        return 27;
      default:
        return 6;
    }
  };

  const activeLine = getActiveLineNumber();
  const f = currentStep.poppedFrame;

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
            <p className="text-[11px] text-slate-400 font-sans">
              Exact code with active execution pointer & inline memory evaluation
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

      {/* 2. Code Body with Shiki Tokens & Preserved Indentation */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[360px] min-h-[300px] bg-[#16161e] p-3 rounded-xl border border-slate-800/90 space-y-0.5 select-text">
        {rawLines.map((rawText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = lineNum === activeLine;
          const tokens = tokenizedLines[idx];
          const annotation = getDynamicAnnotation(lineNum);

          return (
            <div
              key={lineNum}
              className={`relative flex items-center justify-between min-w-max px-2 py-[2px] rounded transition-all duration-150 ${
                isHighlighted
                  ? 'bg-sky-500/20 border-l-2 border-sky-400 shadow-inner'
                  : 'hover:bg-slate-900/40 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center font-mono">
                {/* Gutter Line Number */}
                <span className="w-7 shrink-0 select-none text-[10px] text-slate-600 text-right pr-3">
                  {lineNum}
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

              {/* Dynamic Inline Annotation */}
              {annotation && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-mono text-amber-300 font-bold italic pl-4 shrink-0"
                >
                  {annotation}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Action Narration Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Action: <strong className="text-sky-300">{currentStep.actionTitle}</strong></span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono shrink-0 pl-2">
          Step {currentStep.stepNumber} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
