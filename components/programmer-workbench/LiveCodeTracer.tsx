'use client';

import React from 'react';
import { Terminal, Copy, Check, PlayCircle } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface LiveCodeTracerProps {
  currentStep: TreeStepState;
}

const CODE_LINES = [
  { line: 1, text: 'function postorderTraversal(root: TreeNode | null): number[] {' },
  { line: 2, text: '    if (root === null) return [];' },
  { line: 3, text: '    const result: number[] = [];' },
  { line: 4, text: "    const stack: TraversalFrame[] = [{ node: root, phase: 'expand' }];" },
  { line: 5, text: '' },
  { line: 6, text: '    while (stack.length > 0) {' },
  { line: 7, text: '        const frame = stack.pop()!;' },
  { line: 8, text: '        const current = frame.node;' },
  { line: 9, text: '' },
  { line: 10, text: "        if (frame.phase === 'visit') {" },
  { line: 11, text: '            result.push(current.val);' },
  { line: 12, text: '            continue;' },
  { line: 13, text: '        }' },
  { line: 14, text: '' },
  { line: 15, text: '        // LIFO Scheduling: LEFT -> RIGHT -> ROOT (Push in reverse order)' },
  { line: 16, text: "        stack.push({ node: current, phase: 'visit' });" },
  { line: 17, text: '' },
  { line: 18, text: '        if (current.right !== null) {' },
  { line: 19, text: "            stack.push({ node: current.right, phase: 'expand' });" },
  { line: 20, text: '        }' },
  { line: 21, text: '' },
  { line: 22, text: '        if (current.left !== null) {' },
  { line: 23, text: "            stack.push({ node: current.left, phase: 'expand' });" },
  { line: 24, text: '        }' },
  { line: 25, text: '    }' },
  { line: 26, text: '' },
  { line: 27, text: '    return result;' },
  { line: 28, text: '}' },
];

export function LiveCodeTracer({ currentStep }: LiveCodeTracerProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const fullCode = CODE_LINES.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map step action type to active line index
  const getActiveLineIndex = () => {
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

  const activeLineNum = getActiveLineIndex();

  // Dynamic inline annotation for active line
  const getInlineAnnotation = (lineNum: number) => {
    if (lineNum !== activeLineNum) return null;
    const f = currentStep.poppedFrame;

    switch (lineNum) {
      case 4:
        return '// stack initialized with root';
      case 7:
        return f ? `// popped frame: { node: ${f.node.val}, phase: '${f.phase}' }` : null;
      case 11:
        return f ? `// pushing ${f.node.val} -> result: [${currentStep.resultSnapshot.join(', ')}]` : null;
      case 16:
        return f ? `// pushed visit marker for Node ${f.node.val}` : null;
      case 19:
        return `// pushed right child (expand)`;
      case 23:
        return `// pushed left child (expand -> TOP)`;
      case 27:
        return `// return [${currentStep.resultSnapshot.join(', ')}]`;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200">
            Source Algorithm (Live Execution Pointer)
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Container */}
      <div className="h-[280px] overflow-y-auto space-y-0.5 pr-1 text-[11px] leading-relaxed">
        {CODE_LINES.map(({ line, text }) => {
          const isHighlighted = line === activeLineNum;
          const annotation = getInlineAnnotation(line);

          return (
            <div
              key={line}
              className={`flex items-center justify-between px-2 py-0.5 rounded transition-all duration-150 ${
                isHighlighted
                  ? 'bg-sky-500/20 border-l-2 border-sky-400 text-white font-semibold shadow-inner'
                  : 'hover:bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="flex items-center">
                <span className="w-6 shrink-0 select-none text-[10px] text-slate-600 font-mono">
                  {line}
                </span>
                <span className={isHighlighted ? 'text-sky-200' : 'text-slate-300'}>
                  {text}
                </span>
              </div>

              {/* Dynamic Inline Variable Annotation */}
              {annotation && (
                <span className="text-[10px] font-mono text-amber-300/90 italic pl-3 shrink-0">
                  {annotation}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
