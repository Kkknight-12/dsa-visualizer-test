'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Waves,
  Droplets,
  RotateCcw,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export function TrappingWaterProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'
  >('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Two Pointers Initialization',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 0,
      right: 11,
      leftMax: 0,
      rightMax: 0,
      water: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: 'left=0, right=11. leftMax=0, rightMax=0. Total Water = 0 units.',
      badge: 'Initialization',
    },
    {
      title: 'Step 2: Process left=0 (h=0) & left=1 (h=1) → Update leftMax=1',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 2,
      right: 11,
      leftMax: 1,
      rightMax: 1,
      water: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: 'left=0 (h=0) gives leftMax=0. left=1 (h=1) sets leftMax=1. Peaks cannot trap water.',
      badge: 'Peak Discovery',
    },
    {
      title: 'Step 3: Trap Water at index 2 (height=0, leftMax=1) → +1 Unit!',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 3,
      right: 11,
      leftMax: 1,
      rightMax: 1,
      water: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: 'At index 2, height is 0. Trapped water = leftMax (1) - height (0) = 1 unit!',
      badge: 'Water Trapped!',
    },
    {
      title: 'Step 4: Process right side & Discover leftMax=2 at index 3',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 4,
      right: 10,
      leftMax: 2,
      rightMax: 2,
      water: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      description: 'New peak found at index 3 (height=2). leftMax becomes 2. Right side moves inward.',
      badge: 'Boundary Update',
    },
    {
      title: 'Step 5: Fill Central Basin (indices 4, 5, 6) → +4 Units Trapped!',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 7,
      right: 8,
      leftMax: 2,
      rightMax: 2,
      water: [0, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0],
      description: 'Index 4 (+1), index 5 (+2), index 6 (+1) filled against leftMax=2 wall!',
      badge: 'Deep Basin Fill',
    },
    {
      title: 'Step 6: Pointers Meet at Peak (index 7, h=3) → Total 6 Units!',
      heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      left: 7,
      right: 7,
      leftMax: 3,
      rightMax: 2,
      water: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0],
      description: 'Final state reached! Pointers meet at highest mountain peak (h=3). Total trapped water = 6 units.',
      badge: 'Complete!',
    },
  ];

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-[#070a14] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
              LeetCode 42: Trapping Rain Water — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                Optimal Two Pointers O(N)
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Two Pointers Invariant, Water Height Ceiling Formula & Single-Pass Proof
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

      {/* 2. Main Expandable Content */}
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
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Overview & Formula</span>
              </button>

              <button
                onClick={() => setActiveTab('intuition')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'intuition'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Waves className="w-4 h-4 text-sky-400" />
                <span>2. Water Level Invariant Diagram</span>
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
                <span>3. Interactive Basin Morphing Flow</span>
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
                <span>4. Mathematical Proof (Why Two Pointers?)</span>
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
                <span>5. Complexity & Comparison</span>
              </button>
            </div>

            {/* TAB 1: Problem Overview */}
            {activeTab === 'problem' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-sm text-slate-300">
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                  <h3 className="text-sm font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Problem Definition
                  </h3>
                  <p>
                    Given <code className="font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">n</code> non-negative integers representing an elevation map where the width of each bar is <code className="font-mono text-white">1</code>, compute how much water it can trap after raining.
                  </p>
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed mt-1">
                    🌊 <strong>Core Water Level Formula:</strong> For any bar <code className="font-mono text-white">i</code>:
                    <br />
                    <code className="font-mono font-bold text-sky-300 bg-slate-950/80 px-2 py-0.5 rounded mt-1 inline-block">
                      Water[i] = max(0, min(leftMax, rightMax) - height[i])
                    </code>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input `height`</th>
                        <th className="py-3 px-4">Trapped Water</th>
                        <th className="py-3 px-4 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-cyan-300 font-bold">[0,1,0,2,1,0,1,3,2,1,2,1]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">6 units</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Trapped at indices 2 (+1), 4 (+1), 5 (+2), 6 (+1), 9 (+1) = 6 units total.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-cyan-300 font-bold">[4,2,0,3,2,5]</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">9 units</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Deep basin bounded by walls 4 and 5 traps 9 units of water.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Two Pointers Invariant Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Waves className="w-5 h-5 text-cyan-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        Two Pointers Dynamic Invariant Diagram
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Single-Pass Invariant
                    </span>
                  </div>

                  <div className="w-full bg-[#050811] p-6 rounded-xl border border-slate-800 flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                      {/* Case 1: height[left] <= height[right] */}
                      <div className="p-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/50 flex flex-col gap-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                            Case 1: height[left] &le; height[right]
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Bottleneck: LEFT
                          </span>
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          Right side mein already ek aisi wall hai jo <code className="text-emerald-300 font-mono">height[left]</code> se unchi ya barabar hai. Isliye right side paani ko leak nahi hone dega!
                        </p>
                        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 font-mono">
                          💧 If height[left] &ge; leftMax: <strong>leftMax = height[left]</strong>
                          <br />
                          🌊 Else: <strong>water += leftMax - height[left]</strong>
                          <br />
                          👉 Advance <strong>left++</strong>
                        </div>
                      </div>

                      {/* Case 2: height[left] > height[right] */}
                      <div className="p-4 rounded-xl bg-purple-500/15 border-2 border-purple-500/50 flex flex-col gap-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                            Case 2: height[left] &gt; height[right]
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                            Bottleneck: RIGHT
                          </span>
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          Left side mein already ek unchi wall hai jo <code className="text-purple-300 font-mono">height[right]</code> se badi hai. Isliye bottleneck right side par hai!
                        </p>
                        <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-mono">
                          💧 If height[right] &ge; rightMax: <strong>rightMax = height[right]</strong>
                          <br />
                          🌊 Else: <strong>water += rightMax - height[right]</strong>
                          <br />
                          👈 Advance <strong>right--</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Basin Morphing */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">Interactive Stage Flow:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visualFlowSteps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteractiveStep(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          interactiveStep === idx
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        Frame {idx + 1}: {s.badge}
                      </button>
                    ))}
                  </div>
                </div>

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
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                            leftMax={step.leftMax} (L={step.left})
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                            rightMax={step.rightMax} (R={step.right})
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-200 font-sans leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        💬 <strong className="text-cyan-300 font-bold">Stage Explanation:</strong> {step.description}
                      </p>
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}

            {/* TAB 4: Mathematical Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-400" />
                  Why Two Pointers is 100% Mathematically Sound in O(1) Space
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    A common doubt is: <em>"Jab hum left pointer process kar rahe hote hain, humne center ke saare right bars nahi dekhe. Toh humein kaise pata ki rightMax actual mein kitna hai?"</em>
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-cyan-300 font-bold">1. We only need min(leftMax, rightMax), not the exact maximum of the whole array!</div>
                    <div className="text-emerald-300 font-bold">2. When height[left] &le; height[right], we know there is ALREADY a bar at index `right` that is &ge; leftMax.</div>
                    <div className="text-purple-300 font-bold">3. Therefore, true rightMax &ge; height[right] &ge; leftMax. Thus min(leftMax, trueRightMax) is GUARANTEED to be leftMax!</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 font-mono text-xs text-emerald-100">
                    🔥 <strong>Conclusion:</strong> We never need to know the exact rightMax peak! Knowing that <code className="text-white">trueRightMax &ge; leftMax</code> is mathematically sufficient to calculate the exact water volume at <code className="text-white">left</code>!
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Complexity */}
            {activeTab === 'complexity' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">Complexity Benchmarks</h4>
                  <div className="text-xs font-mono space-y-2">
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Time Complexity:</span>
                      <strong className="text-emerald-400">O(N) (Single Pass)</strong>
                    </div>
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400">O(1) (In-Place Pointers)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">Approach Comparison</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>Brute Force</strong>: O(N^2) Time, O(1) Space — Recalculates max on both sides.</li>
                    <li><strong>Prefix/Suffix Arrays</strong>: O(N) Time, O(N) Space — Precomputes boundary walls.</li>
                    <li><strong>Two Pointers</strong>: <strong>O(N) Time, O(1) Space</strong> — Optimal benchmark!</li>
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
