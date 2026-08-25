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
  Sliders,
} from 'lucide-react';

export function ThreeSumProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'>('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Sort Input Array [-4, -1, -1, 0, 1, 2]',
      array: [-4, -1, -1, 0, 1, 2],
      i: 0,
      left: 1,
      right: 5,
      sum: -3,
      found: [],
      description: 'Input array is sorted in ascending order [-4, -1, -1, 0, 1, 2]. Duplicate values sit adjacent to each other.',
      badge: 'Sorting Phase',
    },
    {
      title: 'Step 2: Fix Anchor i=0 (val = -4) & Scan Two Pointers',
      array: [-4, -1, -1, 0, 1, 2],
      i: 0,
      left: 1,
      right: 5,
      sum: -3,
      found: [],
      description: 'Anchor i=0 (val = -4). Left=1 (val = -1), Right=5 (val = 2). Sum = (-4) + (-1) + 2 = -3 < 0. Move left++ to increase sum!',
      badge: 'Anchor i=0',
    },
    {
      title: 'Step 3: Fix Anchor i=1 (val = -1) → Unique Triplet Found! [-1, -1, 2]',
      array: [-4, -1, -1, 0, 1, 2],
      i: 1,
      left: 2,
      right: 5,
      sum: 0,
      found: [[-1, -1, 2]],
      description: 'Anchor i=1 (val = -1). Left=2 (val = -1), Right=5 (val = 2). Sum = (-1) + (-1) + 2 = 0! Triplet [-1, -1, 2] recorded.',
      badge: 'Triplet Found 🎉',
    },
    {
      title: 'Step 4: Continue Anchor i=1 → Second Triplet Found! [-1, 0, 1]',
      array: [-4, -1, -1, 0, 1, 2],
      i: 1,
      left: 3,
      right: 4,
      sum: 0,
      found: [[-1, -1, 2], [-1, 0, 1]],
      description: 'Left moves to index 3 (val = 0), Right moves to index 4 (val = 1). Sum = (-1) + 0 + 1 = 0! Second triplet [-1, 0, 1] recorded.',
      badge: 'Second Triplet 🎉',
    },
    {
      title: 'Step 5: Anchor Skip & Early Termination',
      array: [-4, -1, -1, 0, 1, 2],
      i: 4,
      left: 5,
      right: 5,
      sum: 0,
      found: [[-1, -1, 2], [-1, 0, 1]],
      description: 'When anchor i reaches index 4 (val = 1 > 0), search terminates early because all subsequent numbers are strictly positive!',
      badge: 'Completed',
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
              LeetCode 15: 3Sum — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                Sorting + 2 Pointers O(N²)
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Anchor fixing, 2-pointer two-sum scanning, duplicate skipping & early termination proofs
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
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>2. 3-Pointer Anchoring & Sorting Diagram</span>
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
                <span>3. Interactive Array Block Morphing</span>
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
                <span>4. Duplicate Skipping & Early Exit Proof</span>
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
                    Given an integer array <code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">nums</code>, return all the unique triplets <code className="font-mono text-amber-300">[nums[i], nums[j], nums[k]]</code> such that <code className="font-mono text-amber-300">i != j</code>, <code className="font-mono text-amber-300">i != k</code>, <code className="font-mono text-amber-300">j != k</code>, and <code className="font-mono text-amber-300">nums[i] + nums[j] + nums[k] == 0</code>.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-100 font-sans leading-relaxed mt-1">
                    💡 <strong>Duplicate Elimination Rule:</strong> The solution set must NOT contain duplicate triplets (e.g. <code className="font-mono text-white">[-1, 0, 1]</code> and <code className="font-mono text-white">[0, 1, -1]</code> are considered identical).
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input `nums`</th>
                        <th className="py-3 px-4">Unique Triplets Result</th>
                        <th className="py-3 px-4 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[-1, 0, 1, 2, -1, -4]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[[-1, -1, 2], [-1, 0, 1]]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Sorted: [-4, -1, -1, 0, 1, 2]. Gives 2 distinct triplets.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[0, 1, 1]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">No 3 elements sum to 0.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[0, 0, 0, 0]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">[[0, 0, 0]]</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Duplicates skipped, returning single [0, 0, 0].</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: 3-Pointer Anchoring & Sorting Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-sky-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Fixed Anchor + Dual Scanning Pointers Strategy
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      O(N²) Two-Pointer Scan
                    </span>
                  </div>

                  {/* 3-Pointer Anchoring Diagram Graphic */}
                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full font-mono">
                      {/* Pointer 1: Fixed Anchor i */}
                      <div className="p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                          Anchor Pointer `i`
                        </span>
                        <div className="text-base font-black text-white bg-amber-500/30 px-3 py-1 rounded-lg border border-amber-400">
                          nums[i]
                        </div>
                        <span className="text-[11px] text-amber-100 text-center font-sans">
                          Outer loop fixes anchor from 0 to n-3. If nums[i] &gt; 0 → Terminate early!
                        </span>
                      </div>

                      {/* Pointer 2: Left Scan Pointer */}
                      <div className="p-4 rounded-xl bg-sky-500/15 border-2 border-sky-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-sky-300 uppercase tracking-widest">
                          Left Pointer `left = i + 1`
                        </span>
                        <div className="text-base font-black text-white bg-sky-500/30 px-3 py-1 rounded-lg border border-sky-400">
                          nums[left]
                        </div>
                        <span className="text-[11px] text-sky-200 text-center font-sans">
                          Scans left-to-right. Move left++ if sum &lt; 0 to increase sum
                        </span>
                      </div>

                      {/* Pointer 3: Right Scan Pointer */}
                      <div className="p-4 rounded-xl bg-purple-500/15 border-2 border-purple-500/50 flex flex-col items-center gap-2 shadow-lg">
                        <span className="text-xs font-black text-purple-300 uppercase tracking-widest">
                          Right Pointer `right = n - 1`
                        </span>
                        <div className="text-base font-black text-white bg-purple-500/30 px-3 py-1 rounded-lg border border-purple-400">
                          nums[right]
                        </div>
                        <span className="text-[11px] text-purple-200 text-center font-sans">
                          Scans right-to-left. Move right-- if sum &gt; 0 to decrease sum
                        </span>
                      </div>
                    </div>

                    {/* Annotation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs font-mono pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                        ⚡ <strong>O(1) Duplicate Skip:</strong> After recording triplet, skip adjacent identical elements: `while (nums[left] == nums[left+1]) left++`.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        🛑 <strong>Elite Dual Pruning:</strong>
                        <br />1. Smallest 3-Sum: `nums[i] + nums[i+1] + nums[i+2] &gt; 0` → <strong>break</strong>!
                        <br />2. Largest 2-Sum: `nums[i] + nums[n-2] + nums[n-1] &lt; 0` → <strong>continue</strong>!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Array Block Morphing Canvas */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                {/* Frame Selector Buttons */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">Interactive Frame Flow:</span>
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

                {/* Active Frame Canvas */}
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
                        <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-bold text-xs">
                          Current Sum: {step.sum}
                        </span>
                      </div>

                      {/* Array Block Elements Canvas */}
                      <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-6 bg-[#050811] rounded-xl border border-slate-800 overflow-x-auto">
                        {step.array.map((val, idx) => {
                          const isAnchor = step.i === idx;
                          const isLeft = step.left === idx;
                          const isRight = step.right === idx;

                          return (
                            <motion.div
                              key={idx}
                              layout
                              className={`relative w-12 h-16 sm:w-14 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-all ${
                                isAnchor
                                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
                                  : isLeft
                                  ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-4 ring-sky-500/30'
                                  : isRight
                                  ? 'bg-purple-500/30 border-purple-400 text-purple-200 ring-4 ring-purple-500/30'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              <span className="text-[10px] font-mono text-slate-400 absolute top-1">[{idx}]</span>
                              <span className="text-xl sm:text-2xl font-black font-mono mt-2">{val}</span>

                              {/* Pointer Badges */}
                              {isAnchor && (
                                <span className="absolute -bottom-7 bg-amber-400 text-slate-950 text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                  i={idx}
                                </span>
                              )}
                              {isLeft && !isAnchor && (
                                <span className="absolute -bottom-7 bg-sky-400 text-slate-950 text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                  LEFT
                                </span>
                              )}
                              {isRight && !isAnchor && (
                                <span className="absolute -bottom-7 bg-purple-400 text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                  RIGHT
                                </span>
                              )}
                            </motion.div>
                          );
                        })}
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
                        Stage 1: Pre-Sort Array (`nums.sort((a, b) =&gt; a - b)`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                          O(N log N) Sorting
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Array ko ascending order me sort kar lene se duplicates ko handle karna ultra-easy ho jata hai aur 2-pointer scan work karta hai.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 2: Fix Anchor `i` & Skip Anchor Duplicates
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                          Anchor Loop
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Loop <code className="font-mono text-amber-300">i</code> runs from 0 to <code className="font-mono text-amber-300">n-3</code>. Agar <code className="font-mono text-rose-300">nums[i] &gt; 0</code>, terminate search immediately. Agar <code className="font-mono text-amber-300">nums[i] == nums[i-1]</code>, skip duplicate anchor!
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 3: Two Pointers Scan (`left` & `right`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                          2Sum Two-Pointer
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Compute <code className="font-mono text-emerald-300">sum = nums[i] + nums[left] + nums[right]</code>:
                        <br />• <code className="font-mono text-emerald-300">sum === 0</code>: Record triplet! Move <code className="font-mono text-sky-300">left++</code> and <code className="font-mono text-purple-300">right--</code>, skipping duplicate values.
                        <br />• <code className="font-mono text-sky-300">sum &lt; 0</code>: Move <code className="font-mono text-sky-300">left++</code> to increase sum.
                        <br />• <code className="font-mono text-purple-300">sum &gt; 0</code>: Move <code className="font-mono text-purple-300">right--</code> to decrease sum.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: Duplicate Skipping & Early Exit Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Why Sorting Eliminates Duplicates and Guarantees O(N²) Optimal Time
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    In an unsorted array, checking for duplicate triplets requires hash set serialization or $O(N^3)$ loops.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-amber-300 font-bold">1. Adjacent Duplicate Clustering: Duplicate values sit next to each other in sorted array.</div>
                    <div className="text-sky-300 font-bold">2. O(1) Anchor Skipping: `if (i &gt; 0 &amp;&amp; nums[i] === nums[i-1]) continue;`</div>
                    <div className="text-purple-300 font-bold">3. Smallest 3-Sum Pruning: `if (nums[i] + nums[i+1] + nums[i+2] &gt; 0) break;`</div>
                    <div className="text-rose-300 font-bold">4. Largest 2-Sum Pruning: `if (nums[i] + nums[n-2] + nums[n-1] &lt; 0) continue;`</div>
                    <div className="text-emerald-300 font-bold">5. O(1) Pointer Skipping: `while (nums[left] === nums[left+1]) left++; while (nums[right] === nums[right-1]) right--;`</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>Mathematical Guarantee:</strong> Sorting guarantees zero duplicate triplet output in $O(N^2)$ time with $O(1)$ auxiliary space overhead!
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
                      <strong className="text-emerald-400 font-extrabold text-sm">O(N log N + N²) = O(N²)</strong>
                    </div>
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm">O(1) Auxiliary Space</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Edge Cases Handling</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>Array Length &lt; 3 (`[0, 1]`)</strong>: Immediately returns `[]`.</li>
                    <li><strong>All Positive (`[1, 2, 3]`) or All Negative (`[-3, -2, -1]`)</strong>: Early exit or no zero sum possible, returns `[]`.</li>
                    <li><strong>All Zeros (`[0, 0, 0, 0]`)</strong>: Safely returns single triplet `[[0, 0, 0]]`.</li>
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
