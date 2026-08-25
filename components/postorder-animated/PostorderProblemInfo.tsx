'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  Lightbulb,
  Compass,
  CheckCircle2,
  Binary,
  Layers,
  GitBranch,
} from 'lucide-react';

export function PostorderProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'>('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Push Root (Node 1) onto Stack 1',
      stack1: [1],
      stack2: [] as number[],
      result: [] as number[],
      activeNode: 1,
      description: 'Algorithm starts by pushing Root Node (1) onto Evaluation Stack 1.',
      badge: 'Start Root',
    },
    {
      title: 'Step 2: Pop Stack 1 (Node 1) → Push to Stack 2 & Children to Stack 1',
      stack1: [2, 3],
      stack2: [1],
      result: [] as number[],
      activeNode: 1,
      description: 'Pop Node 1 from Stack 1 into Stack 2. Push Left child (2) and Right child (3) onto Stack 1.',
      badge: 'Process Root',
    },
    {
      title: 'Step 3: Process Children (Pop Stack 1 → Stack 2)',
      stack1: [2, 4, 5],
      stack2: [1, 3],
      result: [] as number[],
      activeNode: 3,
      description: 'Pop Node 3 from Stack 1 into Stack 2. Push Node 2 left (4) and right (5) onto Stack 1.',
      badge: 'Reverse Scheduling',
    },
    {
      title: 'Step 4: All Nodes Transferred to Stack 2 (Reverse Sequence)',
      stack1: [] as number[],
      stack2: [1, 3, 2, 5, 4],
      result: [] as number[],
      activeNode: null,
      description: 'Stack 1 is empty! Stack 2 now holds modified preorder sequence: [1, 3, 2, 5, 4] (Root → Right → Left).',
      badge: 'Stack 2 Ready',
    },
    {
      title: 'Step 5: Pop Stack 2 to Form Result Array [Left → Right → Root]',
      stack1: [] as number[],
      stack2: [] as number[],
      result: [4, 5, 2, 3, 1],
      activeNode: null,
      description: 'Popping Stack 2 top-to-bottom yields exact LIFO Postorder Traversal: [4, 5, 2, 3, 1]!',
      badge: 'Final Result!',
    },
  ];

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-[#070a14] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
              LeetCode 145: Binary Tree Postorder Traversal — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                LIFO Stack & Tree Graph
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Left → Right → Root recursion order, 2-Stack reverse scheduling & call stack mechanics
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-all shadow-sm"
        >
          <span>{isOpen ? 'Collapse Guide' : 'Expand Full Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Main Expandable Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 flex flex-col gap-5 border-t border-slate-800/60"
          >
            {/* Interactive Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
              <button
                onClick={() => setActiveTab('problem')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'problem'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Overview & Examples</span>
              </button>

              <button
                onClick={() => setActiveTab('intuition')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'intuition'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-4 h-4 text-sky-400" />
                <span>2. Tree Hierarchy & Traversal Order</span>
              </button>

              <button
                onClick={() => setActiveTab('algorithm')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'algorithm'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>3. Interactive 2-Stack Morphing Canvas</span>
              </button>

              <button
                onClick={() => setActiveTab('proof')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'proof'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>4. 2-Stack Reverse Preorder Proof</span>
              </button>

              <button
                onClick={() => setActiveTab('complexity')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'complexity'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>5. Complexity & Edge Cases</span>
              </button>
            </div>

            {/* TAB 1: Problem Overview & Examples */}
            {activeTab === 'problem' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-sm text-slate-300">
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                  <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Target className="w-4 h-4 text-amber-400" />
                    Problem Definition
                  </h3>
                  <p>
                    Given the root of a binary tree, return the <strong>Postorder Traversal</strong> of its nodes' values (<code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">Left Subtree → Right Subtree → Root Node</code>).
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-100 font-sans leading-relaxed mt-1">
                    💡 <strong>Postorder Guarantee:</strong> A node is processed <em>only after</em> both its left and right subtrees have been completely visited!
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Binary Tree Structure</th>
                        <th className="py-3 px-4">Postorder Output</th>
                        <th className="py-3 px-4 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">1 -&gt; (null, 2 -&gt; (3, null))</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[3, 2, 1]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Left subtree empty, visits 3, then 2, then Root 1.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">Full Binary Tree (Root 1, Left 2[4,5], Right 3)</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[4, 5, 2, 3, 1]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Left subtree [4, 5, 2] completed first, then Right 3, finally Root 1.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Tree Hierarchy & Traversal Order Visual Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-sky-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Tree Subtree Dependencies & 3-Stage Traversal Flow
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Bottom-Up Processing
                    </span>
                  </div>

                  {/* Visual 3-Stage Tree Hierarchy Cards */}
                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full font-mono">
                      {/* Stage 1: Left Subtree First */}
                      <div className="p-4 rounded-xl bg-sky-500/15 border-2 border-sky-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-sky-300 uppercase tracking-widest">
                          Stage 1: Left Subtree First
                        </span>
                        <div className="text-base font-black text-white bg-sky-500/30 px-3 py-1 rounded-lg border border-sky-400">
                          Nodes: [4, 5, 2]
                        </div>
                        <span className="text-[11px] text-sky-200 text-center font-sans">
                          Deepest left leaf nodes (4, 5) evaluated before parent 2
                        </span>
                      </div>

                      {/* Stage 2: Right Subtree Next */}
                      <div className="p-4 rounded-xl bg-purple-500/15 border-2 border-purple-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-purple-300 uppercase tracking-widest">
                          Stage 2: Right Subtree Next
                        </span>
                        <div className="text-base font-black text-white bg-purple-500/30 px-3 py-1 rounded-lg border border-purple-400">
                          Nodes: [3]
                        </div>
                        <span className="text-[11px] text-purple-200 text-center font-sans">
                          Right child node evaluated after left subtree completes
                        </span>
                      </div>

                      {/* Stage 3: Root Node Last */}
                      <div className="p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                          Stage 3: Root Node Last
                        </span>
                        <div className="text-base font-black text-white bg-amber-500/30 px-3 py-1 rounded-lg border border-amber-400">
                          Root: [1]
                        </div>
                        <span className="text-[11px] text-amber-100 text-center font-sans">
                          Root node appended last after all children are done
                        </span>
                      </div>
                    </div>

                    {/* Use Case Callouts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs font-mono pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                        🌲 <strong>Bottom-Up Tree Calculations:</strong> Subtree heights, balance factors, and node deletions MUST process children before parents.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        📚 <strong>Expression Tree Evaluation:</strong> Evaluates child operands before applying the parent operator.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive 2-Stack Morphing Canvas */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                {/* Frame Selector Buttons */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">Interactive 2-Stack Flow:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visualFlowSteps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteractiveStep(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          interactiveStep === idx
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        Frame {idx + 1}: {s.badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Frame Canvas displaying Stack 1, Stack 2, and Result Array */}
                {(() => {
                  const step = visualFlowSteps[interactiveStep];
                  return (
                    <motion.div
                      key={interactiveStep}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-gradient-to-b from-[#0b101d] to-[#070a14] border border-slate-800 flex flex-col gap-6 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <h4 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          {step.title}
                        </h4>
                      </div>

                      {/* 2-Stack Sub-Grid Display */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#050811] p-6 rounded-xl border border-slate-800">
                        {/* Stack 1 (Evaluation Stack) */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-3">
                          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-4 h-4" /> Stack 1 (Evaluation)
                          </span>
                          <div className="w-full min-h-[100px] border border-slate-800 rounded-lg bg-slate-950 p-3 flex flex-wrap gap-2 items-center justify-center">
                            {step.stack1.length === 0 ? (
                              <span className="text-xs font-mono text-slate-600">Empty</span>
                            ) : (
                              step.stack1.map((node, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-sky-500/25 border border-sky-400 text-sky-300 font-mono font-bold text-sm">
                                  Node {node}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Stack 2 (Reverse Output Stack) */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-3">
                          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-4 h-4" /> Stack 2 (Reverse Scheduling)
                          </span>
                          <div className="w-full min-h-[100px] border border-slate-800 rounded-lg bg-slate-950 p-3 flex flex-wrap gap-2 items-center justify-center">
                            {step.stack2.length === 0 ? (
                              <span className="text-xs font-mono text-slate-600">Empty</span>
                            ) : (
                              step.stack2.map((node, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-purple-500/25 border border-purple-400 text-purple-300 font-mono font-bold text-sm">
                                  Node {node}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Result Array */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-3">
                          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Final Result Array
                          </span>
                          <div className="w-full min-h-[100px] border border-slate-800 rounded-lg bg-slate-950 p-3 flex flex-wrap gap-2 items-center justify-center">
                            {step.result.length === 0 ? (
                              <span className="text-xs font-mono text-slate-600">Awaiting Pop</span>
                            ) : (
                              step.result.map((node, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-mono font-bold text-sm">
                                  {node}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Explanation Callout */}
                      <p className="text-sm text-slate-200 font-sans leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        💬 <strong className="text-amber-300 font-bold">Stage Explanation:</strong> {step.description}
                      </p>
                    </motion.div>
                  );
                })()}

                {/* Complete Written Stage Breakdown List */}
                <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Full Stage-by-Stage Text Breakdown & WHY Logic:
                  </h4>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 1: Recursive Subtree Traversal (`Left → Right → Root`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                          Call Stack Order
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Pehle <code className="font-mono text-sky-300">postorder(node.left)</code>, phir <code className="font-mono text-sky-300">postorder(node.right)</code>, aur aakhir me <code className="font-mono text-amber-300">node.val</code> process hota hai.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 2: Iterative 2-Stack Reverse Strategy
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                          Modified Preorder (Root → Right → Left)
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Stack 1 me nodes ko push/pop karke Stack 2 me transfer karo. Stack 2 me nodes automatically <code className="font-mono text-purple-300">Root → Right → Left</code> order me arrange ho jate hain.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> Stack LIFO (Last-In-First-Out) property ki wajah se Stack 2 ko pop karne par order exact reverse hokar <code className="text-emerald-300 font-bold">Left → Right → Root</code> ban jata hai!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: 2-Stack Reverse Preorder Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Why Reverse Preorder (Root → Right → Left) equals Postorder (Left → Right → Root)
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    Modified preorder traversal visits nodes in the order: <code className="font-mono text-sky-300">Root → Right → Left</code>.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-purple-300 font-bold">1. Standard Preorder: Root → Left → Right</div>
                    <div className="text-sky-300 font-bold">2. Modified Preorder (Push Left first, then Right to Stack): Root → Right → Left</div>
                    <div className="text-emerald-300 font-bold">3. Reversing Sequence (via Stack 2 LIFO pop): Left → Right → Root!</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>Mathematical Identity:</strong> <code className="text-white">Reversed(Root → Right → Left) ≡ Left → Right → Root</code>. A second LIFO stack naturally inverts modified preorder into exact postorder traversal in O(N) time!
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Complexity & Edge Cases */}
            {activeTab === 'complexity' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">Complexity Benchmarks</h4>
                  <div className="text-xs font-mono space-y-2">
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Time Complexity:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">O(N)</strong>
                    </div>
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">O(N) (Recursion Stack / 2-Stack LIFO)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Edge Cases Handling</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>Empty Tree (`null`)</strong>: Returns empty array `[]` instantly without stack allocation.</li>
                    <li><strong>Single Node (`[1]`)</strong>: Pushes and pops 1 step returning `[1]`.</li>
                    <li><strong>Skewed Tree (`1 -&gt; 2 -&gt; 3`)</strong>: Deep recursion call stack safely handles linear depth.</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
