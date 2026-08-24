'use client';

import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  activeLine: number;
}

const CODE_LINES = [
  { line: 1, text: 'function postorderTraversal(root: TreeNode | null): number[] {' },
  { line: 2, text: '    if (root === null) {' },
  { line: 3, text: '        return [];' },
  { line: 4, text: '    }' },
  { line: 5, text: '' },
  { line: 6, text: '    const result: number[] = [];' },
  { line: 7, text: "    const stack: TraversalFrame[] = [{ node: root, phase: 'expand' }];" },
  { line: 8, text: '' },
  { line: 9, text: '    while (stack.length > 0) {' },
  { line: 10, text: '        const frame = stack.pop()!;' },
  { line: 11, text: '        const current = frame.node;' },
  { line: 12, text: '' },
  { line: 13, text: "        if (frame.phase === 'visit') {" },
  { line: 14, text: '            result.push(current.val);' },
  { line: 15, text: '            continue;' },
  { line: 16, text: '        }' },
  { line: 17, text: '' },
  { line: 18, text: '        // Desired execution: LEFT -> RIGHT -> ROOT (Reverse LIFO Schedule)' },
  { line: 19, text: "        stack.push({ node: current, phase: 'visit' }); // 1. Root Visit (Bottom)" },
  { line: 20, text: '' },
  { line: 21, text: '        if (current.right !== null) {' },
  { line: 22, text: "            stack.push({ node: current.right, phase: 'expand' }); // 2. Right Child" },
  { line: 23, text: '        }' },
  { line: 24, text: '' },
  { line: 25, text: '        if (current.left !== null) {' },
  { line: 26, text: "            stack.push({ node: current.left, phase: 'expand' });  // 3. Left Child (Top)" },
  { line: 27, text: '        }' },
  { line: 28, text: '    }' },
  { line: 29, text: '' },
  { line: 30, text: '    return result;' },
  { line: 31, text: '}' },
];

export function CodeViewer({ activeLine }: CodeViewerProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const fullCode = CODE_LINES.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map step line to matching CODE_LINES
  const getIsActive = (lineNumber: number) => {
    if (activeLine === 6 && (lineNumber === 6 || lineNumber === 7)) return true;
    if (activeLine === 9 && (lineNumber === 9 || lineNumber === 10 || lineNumber === 11)) return true;
    if (activeLine === 14 && (lineNumber === 13 || lineNumber === 14 || lineNumber === 15)) return true;
    if (activeLine === 23 && lineNumber === 19) return true;
    if (activeLine === 27 && (lineNumber === 21 || lineNumber === 22)) return true;
    if (activeLine === 33 && (lineNumber === 25 || lineNumber === 26)) return true;
    if (activeLine === 38 && lineNumber === 30) return true;
    return false;
  };

  return (
    <div className="flex flex-col w-full h-[320px] bg-[#030712]/95 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-mono font-medium text-slate-200">
            postorderTraversal.ts
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
            Phase State Machine
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Lines Display */}
      <div className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] leading-snug space-y-0.5">
        {CODE_LINES.map(({ line, text }) => {
          const isHighlighted = getIsActive(line);
          const isComment = text.trim().startsWith('//');

          return (
            <div
              key={line}
              className={`flex items-center px-2 py-0.5 rounded transition-all duration-200 ${
                isHighlighted
                  ? 'bg-sky-500/20 border-l-2 border-sky-400 text-sky-100 font-semibold shadow-inner'
                  : 'hover:bg-slate-900/40 text-slate-400'
              }`}
            >
              {/* Line Number */}
              <span className="w-6 shrink-0 select-none text-[10px] text-slate-600 font-mono">
                {line}
              </span>

              {/* Code Line Text */}
              <span
                className={`whitespace-pre ${
                  isHighlighted
                    ? 'text-sky-200 font-bold'
                    : isComment
                    ? 'text-emerald-500/80 italic'
                    : 'text-slate-300'
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
