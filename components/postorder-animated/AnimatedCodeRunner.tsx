'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { TreeStepState } from '@/types/treeTraversal';

interface AnimatedCodeRunnerProps {
  currentStep: TreeStepState;
  totalSteps: number;
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
  { line: 15, text: '        // LIFO Scheduling: ROOT -> RIGHT -> LEFT pushes' },
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

export function AnimatedCodeRunner({ currentStep, totalSteps }: AnimatedCodeRunnerProps) {
  // Map action to active line
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

  const activeLine = getActiveLineIndex();
  const f = currentStep.poppedFrame;

  const getDynamicAnnotation = (lineNum: number) => {
    if (lineNum !== activeLine) return null;
    switch (lineNum) {
      case 4:
        return '// stack initialized with root node';
      case 7:
        return f ? `// popped: { node: Node(${f.node.val}), phase: '${f.phase}' }` : null;
      case 11:
        return f ? `// append ${f.node.val} -> result = [${currentStep.resultSnapshot.join(', ')}]` : null;
      case 16:
        return f ? `// push visit marker for Node ${f.node.val} to bottom of this subtree` : null;
      case 19:
        return `// push right child (will execute after left)`;
      case 23:
        return `// push left child to TOP of stack (executes FIRST)`;
      case 27:
        return `// return final array [${currentStep.resultSnapshot.join(', ')}]`;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between font-mono text-xs">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Synchronized Code Runner
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Step {currentStep.stepNumber} of {totalSteps} — Active Execution Pointer
            </p>
          </div>
        </div>
      </div>

      {/* 2. Code Listing with Animated Active Pointer */}
      <div className="h-[230px] overflow-y-auto space-y-0.5 pr-1 text-[11px] leading-relaxed">
        {CODE_LINES.map(({ line, text }) => {
          const isHighlighted = line === activeLine;
          const annotation = getDynamicAnnotation(line);

          return (
            <div
              key={line}
              className={`relative flex items-center justify-between px-2 py-0.5 rounded transition-all duration-150 ${
                isHighlighted
                  ? 'bg-sky-500/20 text-white font-semibold shadow-inner'
                  : 'hover:bg-slate-900/40 text-slate-400'
              }`}
            >
              {/* Active Marker Bar */}
              {isHighlighted && (
                <motion.div
                  layoutId="active-code-pointer"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-r shadow-lg shadow-sky-400/50"
                />
              )}

              <div className="flex items-center pl-1">
                <span className="w-6 shrink-0 select-none text-[10px] text-slate-600 font-mono">
                  {line}
                </span>
                <span className={isHighlighted ? 'text-sky-200' : 'text-slate-300'}>
                  {text}
                </span>
              </div>

              {/* Dynamic Annotation */}
              {annotation && (
                <span className="text-[10px] font-mono text-amber-300 italic pl-3 shrink-0">
                  {annotation}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Step Explanation & Dry-Run Reasoning Box */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentStep.actionTitle}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-sans text-slate-300 leading-relaxed">
          {currentStep.hinglishNarration}
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] font-sans text-amber-200">
          <strong className="text-amber-300 block mb-0.5">💡 LIFO Scheduling Principle:</strong>
          {currentStep.whyRule}
        </div>
      </div>
    </div>
  );
}
