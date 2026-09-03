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
  Search,
  RotateCcw,
  CheckCircle2,
  Compass,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

export function SearchRotatedArrayProblemInfo() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'problem' | 'intuition' | 'algorithm' | 'proof' | 'complexity'
  >('problem');
  const [interactiveStep, setInteractiveStep] = useState<number>(0);

  const visualFlowSteps = [
    {
      title: 'Step 1: Pointers at Full Array Bounds [low=0, high=6]',
      array: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      low: 0,
      high: 6,
      mid: 3,
      sortedHalf: 'left',
      eliminated: null as [number, number] | null,
      description: 'Pointers initialize at ends. mid=3 (nums[mid]=7). nums[low=0]=4 <= nums[mid]=7, so Left Half [4,5,6,7] is strictly sorted.',
      badge: 'Initialization',
    },
    {
      title: 'Step 2: Check Target 0 in Left Sorted Half [4 ... 7] -> Eliminate Left!',
      array: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      low: 4,
      high: 6,
      mid: 3,
      sortedHalf: 'left',
      eliminated: [0, 3] as [number, number],
      description: 'Is target (0) inside [4 ... 7]? NO! Target cannot exist in left half. Eliminate [0 ... 3] and advance low=4.',
      badge: 'Range Elimination',
    },
    {
      title: 'Step 3: Inspect New Subarray [low=4, high=6] -> mid=5 (nums[mid]=1)',
      array: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      low: 4,
      high: 6,
      mid: 5,
      sortedHalf: 'left',
      eliminated: [0, 3] as [number, number],
      description: 'New range is [0, 1, 2]. mid=5 (val=1). nums[low=4]=0 <= nums[mid=5]=1, so Left Half [0, 1] is sorted!',
      badge: 'Sub-Range Check',
    },
    {
      title: 'Step 4: Target 0 is in Left Half [0 ... 1] -> Eliminate Right & Match!',
      array: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      low: 4,
      high: 4,
      mid: 4,
      sortedHalf: 'left',
      eliminated: [5, 6] as [number, number],
      description: 'Target 0 is between [0 ... 1]. Set high=mid-1=4. Now low=4, high=4 -> mid=4. nums[4] === 0 MATCH FOUND!',
      badge: 'Target Match!',
    },
  ];

  return (
    <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-[#070a14] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold shadow-md shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
              LeetCode 33: Search in Rotated Sorted Array — Master Visual Guide
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-bold">
                Modified Binary Search O(log N)
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sorted Half Identification Invariant & Dynamic Range Elimination
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
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg'
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
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>2. "Always Sorted Half" Invariant</span>
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
                <span>3. Range Eliminator Flow</span>
              </button>

              <button
                onClick={() => setActiveTab('proof')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'proof'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>4. Mathematical Invariant Proof</span>
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

            {/* TAB 1: Problem Overview */}
            {activeTab === 'problem' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-sm text-slate-300">
                <div className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                  <h3 className="text-sm font-extrabold text-sky-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Target className="w-4 h-4 text-sky-400" />
                    Problem Definition
                  </h3>
                  <p>
                    An integer array <code className="font-mono text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded">nums</code> sorted in ascending order with <strong>distinct values</strong> is rotated at an unknown pivot index <code className="font-mono text-white">k</code>. Given <code className="font-mono text-white">target</code>, return its index if found, or <code className="font-mono text-rose-400 font-bold">-1</code> otherwise.
                  </p>
                  <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs sm:text-sm text-sky-100 font-sans leading-relaxed mt-1">
                    ⚡ <strong>Mandatory Constraint:</strong> You must write an algorithm with <strong>O(log n)</strong> runtime complexity.
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a14]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Input `nums`</th>
                        <th className="py-3 px-4">`target`</th>
                        <th className="py-3 px-4">Output</th>
                        <th className="py-3 px-4 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-sky-300 font-bold">[4,5,6,7,0,1,2]</td>
                        <td className="py-3 px-4 text-amber-300 font-bold">0</td>
                        <td className="py-3 px-4 text-emerald-300 font-bold">4</td>
                        <td className="py-3 px-4 font-sans text-slate-300">0 is present at index 4.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-sky-300 font-bold">[4,5,6,7,0,1,2]</td>
                        <td className="py-3 px-4 text-amber-300 font-bold">3</td>
                        <td className="py-3 px-4 text-rose-400 font-bold">-1</td>
                        <td className="py-3 px-4 font-sans text-slate-300">3 is not present in the array.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-sky-300 font-bold">[1]</td>
                        <td className="py-3 px-4 text-amber-300 font-bold">0</td>
                        <td className="py-3 px-4 text-rose-400 font-bold">-1</td>
                        <td className="py-3 px-4 font-sans text-slate-300">Single element doesn't match target.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Invariant Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-400 shrink-0" />
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        The "Always Sorted Half" Invariant
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      Binary Search Invariant
                    </span>
                  </div>

                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    Rotated sorted array ko kisi bhi index <code className="text-sky-300 font-mono">mid</code> par cut karo, ek half hamesha strictly sorted hota hai!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                    {/* Left Half Sorted */}
                    <div className="p-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/50 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                          Case 1: nums[low] &le; nums[mid]
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          LEFT IS SORTED
                        </span>
                      </div>
                      <p className="text-xs font-sans text-slate-300 leading-relaxed">
                        Left portion <code className="text-emerald-300">[low ... mid]</code> is monotonically increasing!
                      </p>
                      <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 font-mono">
                        🎯 If <strong>nums[low] &le; target &lt; nums[mid]</strong>:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Target is inside Left! &rarr; <strong>high = mid - 1</strong>
                        <br />
                        🚫 Else:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Target is in Right! &rarr; <strong>low = mid + 1</strong>
                      </div>
                    </div>

                    {/* Right Half Sorted */}
                    <div className="p-4 rounded-xl bg-purple-500/15 border-2 border-purple-500/50 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest">
                          Case 2: nums[mid] &le; nums[high]
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          RIGHT IS SORTED
                        </span>
                      </div>
                      <p className="text-xs font-sans text-slate-300 leading-relaxed">
                        Right portion <code className="text-purple-300">[mid ... high]</code> is monotonically increasing!
                      </p>
                      <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-mono">
                        🎯 If <strong>nums[mid] &lt; target &le; nums[high]</strong>:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Target is inside Right! &rarr; <strong>low = mid + 1</strong>
                        <br />
                        🚫 Else:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;Target is in Left! &rarr; <strong>high = mid - 1</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Flow */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 text-sm text-slate-300">
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 px-2">Interactive Stages:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visualFlowSteps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteractiveStep(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          interactiveStep === idx
                            ? 'bg-sky-500 text-slate-950 shadow-md'
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
                          <CheckCircle2 className="w-5 h-5 text-sky-400" />
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                            low={step.low}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                            mid={step.mid}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                            high={step.high}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-200 font-sans leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                        💬 <strong className="text-sky-300 font-bold">Stage Explanation:</strong> {step.description}
                      </p>
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}

            {/* TAB 4: Mathematical Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3 text-sm text-slate-300">
                <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                  Why at least ONE half is ALWAYS sorted in any rotated array
                </h3>
                <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    Rotated array originally strictly increasing tha. Ek single rotation point (pivot) hota hai jahan array &apos;drop&apos; karta hai (e.g. 7 &rarr; 0).
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-emerald-300 font-bold">1. A single drop point can only fall into EITHER the left half OR the right half.</div>
                    <div className="text-sky-300 font-bold">2. It CANNOT fall into both halves simultaneously!</div>
                    <div className="text-purple-300 font-bold">3. Therefore, whichever half does NOT contain the drop point is GUARANTEED to be 100% sorted!</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 font-mono text-xs text-amber-100">
                    🔥 <strong>Mathematical Consequence:</strong> We can always test membership in the sorted half in O(1) time using simple boundary checks <code className="text-white">nums[start] &le; target &le; nums[end]</code>. Thus, 50% of the search space is eliminated on EVERY step!
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
                      <strong className="text-emerald-400">O(log N)</strong>
                    </div>
                    <div className="flex justify-between bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span>Space Complexity:</span>
                      <strong className="text-emerald-400">O(1) (In-Place)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 flex flex-col gap-3">
                  <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">Edge Cases Handled</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 font-sans text-slate-300">
                    <li><strong>Single Element Array</strong> (`[1]`, target=0 or 1): Handled cleanly.</li>
                    <li><strong>Target at Boundaries</strong>: Handled with inclusive inequality checks.</li>
                    <li><strong>Unrotated / Fully Sorted</strong> (`[1, 2, 3, 4]`): Works as standard binary search.</li>
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
