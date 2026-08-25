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
  Activity,
} from 'lucide-react';

export function KadanesProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'>('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Start Accumulating at Index 0 (val = -2)',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: -2,
      maxSum: -2,
      highlightIndex: 0,
      windowRange: [0, 0] as [number, number],
      isReset: true,
      description: 'First element is -2. Current Sum = -2, Max Sum = -2. Since sum < 0, reset currentSum to 0 before moving forward!',
      badge: 'Initialization',
    },
    {
      title: 'Step 2: Start Fresh at Index 1 (val = 1)',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: 1,
      maxSum: 1,
      highlightIndex: 1,
      windowRange: [1, 1] as [number, number],
      isReset: false,
      description: 'Previous negative sum was discarded. Add 1 → Current Sum = 1, Max Sum updated to 1.',
      badge: 'Fresh Start',
    },
    {
      title: 'Step 3: Accumulate Index 2 (val = -3) → Drop to Negative',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: -2,
      maxSum: 1,
      highlightIndex: 2,
      windowRange: [1, 2] as [number, number],
      isReset: true,
      description: '1 + (-3) = -2 (negative sum). Max Sum remains 1. Reset currentSum to 0!',
      badge: 'Negative Reset',
    },
    {
      title: 'Step 4: Start Subarray at Index 3 (val = 4)',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: 4,
      maxSum: 4,
      highlightIndex: 3,
      windowRange: [3, 3] as [number, number],
      isReset: false,
      description: 'Start new positive subarray at index 3! Current Sum = 4, Max Sum updated to 4.',
      badge: 'Subarray Start',
    },
    {
      title: 'Step 5: Accumulate Subarray [4, -1, 2, 1] → Peak Max Sum = 6!',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: 6,
      maxSum: 6,
      highlightIndex: 6,
      windowRange: [3, 6] as [number, number],
      isReset: false,
      description: 'Sum accumulates 4 + (-1) + 2 + 1 = 6 at index 6! New global maximum sum recorded for contiguous subarray [4, -1, 2, 1].',
      badge: 'Peak Max Achieved',
    },
    {
      title: 'Step 6: Single Pass Completed → Max Subarray Sum = 6',
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      currentSum: 5,
      maxSum: 6,
      highlightIndex: 8,
      windowRange: [3, 6] as [number, number],
      isReset: false,
      description: 'Scan finished. Maximum Subarray Sum found is 6 (Subarray elements: [4, -1, 2, 1] at indices 3..6).',
      badge: 'Final Result!',
    },
  ];

  const waveFormData = [
    { idx: 0, val: -2, sum: -2, reset: true },
    { idx: 1, val: 1, sum: 1, reset: false },
    { idx: 2, val: -3, sum: -2, reset: true },
    { idx: 3, val: 4, sum: 4, reset: false },
    { idx: 4, val: -1, sum: 3, reset: false },
    { idx: 5, val: 2, sum: 5, reset: false },
    { idx: 6, val: 1, sum: 6, reset: false, isPeak: true },
    { idx: 7, val: -5, sum: 1, reset: false },
    { idx: 8, val: 4, sum: 5, reset: false },
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
              LeetCode 53: Kadane's Algorithm — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                Single Pass O(N) Greedy
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Running sum waveform chart, negative prefix discard proofs & interactive array morphing canvas
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
                <Activity className="w-4 h-4 text-sky-400" />
                <span>2. Running Sum Waveform Chart</span>
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
                <span>3. Interactive Array Subarray Window</span>
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
                <span>4. Negative Prefix Discard Proof</span>
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
                    Given an integer array <code className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return <em>its sum</em>.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-100 font-sans leading-relaxed mt-1">
                    💡 <strong>Contiguous Subarray Meaning:</strong> Elements must be consecutive without skipping! For example, in <code className="font-mono text-white">[-2, 1, -3, 4, -1, 2, 1, -5, 4]</code>, the contiguous subarray <code className="font-mono text-white">[4, -1, 2, 1]</code> gives the maximum sum of <strong>6</strong>.
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input `nums`</th>
                        <th className="py-3 px-4">Max Subarray Sum</th>
                        <th className="py-3 px-4 font-sans">Contiguous Subarray</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[-2, 1, -3, 4, -1, 2, 1, -5, 4]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">6</td>
                        <td className="py-3 px-4 font-sans text-slate-300">[4, -1, 2, 1] at indices 3..6</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[1]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">1</td>
                        <td className="py-3 px-4 font-sans text-slate-300">[1]</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-amber-300 font-bold">[5, 4, -1, 7, 8]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">23</td>
                        <td className="py-3 px-4 font-sans text-slate-300">[5, 4, -1, 7, 8] (Entire array)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Running Sum Waveform Chart */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Running Sum Waveform & Reset Threshold Chart
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
                    </span>
                  </div>

                  {/* SVG Waveform Chart Canvas */}
                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-end justify-center gap-3 sm:gap-4 h-48 w-full max-w-xl px-2">
                      {waveFormData.map((item) => {
                        const heightPx = Math.max(24, Math.abs(item.sum) * 24);
                        const isPositive = item.sum > 0;

                        return (
                          <div key={item.idx} className="flex flex-col items-center gap-2 relative">
                            {item.isPeak && (
                              <div className="absolute -top-10 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-mono font-black shadow-lg animate-bounce">
                                ★ PEAK (6)
                              </div>
                            )}
                            {item.reset && (
                              <div className="absolute -top-8 bg-rose-500 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shadow">
                                RESET
                              </div>
                            )}

                            <span className="text-[10px] font-mono font-bold text-slate-400">[{item.idx}]</span>
                            <div
                              style={{ height: `${heightPx}px` }}
                              className={`w-10 sm:w-12 border-2 rounded-t-xl flex flex-col items-center justify-center text-xs font-black font-mono shadow-lg transition-all ${
                                item.isPeak
                                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
                                  : item.reset
                                  ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                                  : 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                              }`}
                            >
                              <span>{item.sum}</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">val:{item.val}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart Annotation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs font-mono pt-2 border-t border-slate-800">
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200">
                        ❌ <strong>Negative Debt Reset (<code className="font-mono text-rose-300">sum &lt; 0</code>):</strong> Whenever <code className="font-mono text-slate-200">currentSum</code> drops below 0 (indices 0 &amp; 2), carrying it forward only hurts future sums. Reset to 0 immediately!
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        🏆 <strong>Global Max Peak (Sum = 6):</strong> Accumulated subarray `[4, -1, 2, 1]` reaches peak sum of 6 at index 6!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Array Subarray Window Canvas */}
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

                {/* Active Frame Block Canvas */}
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
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                            CurrentSum: {step.currentSum}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold">
                            MaxSum: {step.maxSum}
                          </span>
                        </div>
                      </div>

                      {/* Array Block Elements Canvas */}
                      <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-6 bg-[#050811] rounded-xl border border-slate-800 overflow-x-auto">
                        {step.array.map((val, idx) => {
                          const isCurrent = step.highlightIndex === idx;
                          const inSubarrayWindow = idx >= step.windowRange[0] && idx <= step.windowRange[1];

                          return (
                            <motion.div
                              key={idx}
                              layout
                              className={`relative w-12 h-16 sm:w-14 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-all ${
                                isCurrent
                                  ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-4 ring-amber-500/30'
                                  : inSubarrayWindow
                                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                  : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              <span className="text-[10px] font-mono text-slate-400 absolute top-1">[{idx}]</span>
                              <span className="text-xl sm:text-2xl font-black font-mono mt-2">{val}</span>

                              {/* Pointer Badges */}
                              {isCurrent && (
                                <span className="absolute -bottom-7 bg-amber-400 text-slate-950 text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                                  i={idx}
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
                        Stage 1: Single Pass Accumulation (`currentSum += nums[i]`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                          Greedy Running Sum
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Array me index <code className="font-mono text-sky-300">0</code> se <code className="font-mono text-sky-300">n-1</code> tak iterate karte hue har element ko <code className="font-mono text-amber-300">currentSum</code> me add karte jao.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 2: Negative Prefix Reset Rule (`if currentSum &lt; 0 → currentSum = 0`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                          Discard Negative Debt
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Agar kisi bhi point par <code className="font-mono text-rose-300">currentSum &lt; 0</code> ho jaye, toh ise immediately <code className="font-mono text-sky-300">currentSum = 0</code> par reset kar do!
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        💡 <strong>WHY?</strong> Negative prefix ko aage carry karne par future subarray sum hamesha ghat-ta (decrease hota) hai. Subarray ko fresh start dena optimal hota hai!
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        Stage 3: Global Max Tracking (`maxSum = max(maxSum, currentSum)`)
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                          Record All-Time Best
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Har step par global maximum variable <code className="font-mono text-emerald-300">maxSum</code> ko update karo.
                      </p>
                      <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        Example: Subarray <code className="text-emerald-300">[4, -1, 2, 1]</code> reaches sum 6, recording global peak!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: Negative Prefix Discard Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Why Discarding Negative Prefix Sums is Mathematically Optimal
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    Suppose a prefix subarray has sum <code className="text-rose-300 font-mono">S &lt; 0</code>. Any future contiguous subarray starting after this prefix will have sum <code className="text-emerald-300 font-mono">X</code>.
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-rose-300 font-bold">1. With Prefix Included: Combined Sum = X + S</div>
                    <div className="text-emerald-300 font-bold">2. Without Prefix (Fresh Start): Sum = X</div>
                    <div className="text-amber-300 font-bold">3. Since S &lt; 0, X + S &lt; X is ALWAYS true!</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>Mathematical Guarantee:</strong> Dropping negative prefix sums guarantees we NEVER handicap future subarray maximums, guaranteeing a global optimal solution in single pass O(N) time!
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
                      <strong className="text-emerald-400 font-extrabold text-sm">O(1)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Edge Cases Handling</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>All Negative Elements (`[-3, -1, -5]`)</strong>: <code className="font-mono text-amber-300">maxSum</code> initializes to first element (-3), returning the maximum single negative element cleanly.</li>
                    <li><strong>Single Element Array (`[5]`)</strong>: Instantly returns 5 without loop overhead.</li>
                    <li><strong>All Positive Elements (`[5, 4, 1, 7]`)</strong>: Accumulates entire array sum.</li>
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
