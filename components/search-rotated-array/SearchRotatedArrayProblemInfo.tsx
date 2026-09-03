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
      description: 'Target 0 is between [0 ... 1]. Set high=mid-1=4. Now low=4, high=4 -> mid=4. nums[4] === 0 MATCH FOUND!',
      badge: 'Target Match!',
    },
  ];

  return (
    <div className="w-full bg-[#0a0d16] border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl font-sans overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#080b14] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wide flex items-center gap-2">
              LeetCode 33: Search in Rotated Sorted Array — Concept & Proof Guide
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium">
                O(log N)
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sorted Half Identification Invariant & Range Halving Proof
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-all"
        >
          <span>{isOpen ? 'Collapse Guide' : 'Expand Guide'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Main Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 flex flex-col gap-4 border-t border-slate-800/60"
          >
            {/* Unified Professional Navigation Tab Bar (No Rainbow Colors) */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 font-mono text-xs">
              {[
                { id: 'problem', label: '1. Overview & Examples', icon: FileText },
                { id: 'intuition', label: '2. "Always Sorted Half" Invariant', icon: Sliders },
                { id: 'algorithm', label: '3. Range Eliminator Flow', icon: Compass },
                { id: 'proof', label: '4. Mathematical Proof', icon: RotateCcw },
                { id: 'complexity', label: '5. Complexity & Edge Cases', icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-xs ${
                      isActive
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-900/40 text-slate-400 border border-slate-800/60 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Problem Overview */}
            {activeTab === 'problem' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs uppercase tracking-wider font-mono">
                    <Target className="w-3.5 h-3.5 text-sky-400" />
                    <span>Problem Statement</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 font-sans">
                    An integer array <code className="font-mono text-sky-300 bg-sky-500/10 px-1 py-0.5 rounded">nums</code> sorted in ascending order with <strong>distinct values</strong> is rotated at an unknown pivot index <code className="font-mono text-slate-200">k</code>. Given <code className="font-mono text-slate-200">target</code>, return its index if found, or <code className="font-mono text-rose-400 font-semibold">-1</code> otherwise.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono mt-1">
                    Constraint: Time Complexity must be strictly <strong>O(log n)</strong>.
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#070a12]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase border-b border-slate-800/80">
                      <tr>
                        <th className="py-2.5 px-3.5">Input `nums`</th>
                        <th className="py-2.5 px-3.5">`target`</th>
                        <th className="py-2.5 px-3.5">Output</th>
                        <th className="py-2.5 px-3.5 font-sans">Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr className="hover:bg-slate-900/20">
                        <td className="py-2.5 px-3.5 font-semibold text-slate-200">[4,5,6,7,0,1,2]</td>
                        <td className="py-2.5 px-3.5 text-sky-400">0</td>
                        <td className="py-2.5 px-3.5 text-emerald-400 font-bold">4</td>
                        <td className="py-2.5 px-3.5 font-sans text-slate-400">0 is present at index 4.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/20">
                        <td className="py-2.5 px-3.5 font-semibold text-slate-200">[4,5,6,7,0,1,2]</td>
                        <td className="py-2.5 px-3.5 text-sky-400">3</td>
                        <td className="py-2.5 px-3.5 text-slate-500 font-bold">-1</td>
                        <td className="py-2.5 px-3.5 font-sans text-slate-400">3 is not present in the array.</td>
                      </tr>
                      <tr className="hover:bg-slate-900/20">
                        <td className="py-2.5 px-3.5 font-semibold text-slate-200">[1]</td>
                        <td className="py-2.5 px-3.5 text-sky-400">0</td>
                        <td className="py-2.5 px-3.5 text-slate-500 font-bold">-1</td>
                        <td className="py-2.5 px-3.5 font-sans text-slate-400">Single element doesn&apos;t match target.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Invariant Diagram */}
            {activeTab === 'intuition' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-200 font-mono uppercase tracking-wider">
                        The &quot;Always Sorted Half&quot; Invariant
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-400 leading-relaxed">
                    Rotated sorted array ko kisi bhi index <code className="text-sky-300 font-mono">mid</code> par split karo, AT LEAST EK HALF hamesha strictly sorted rehta hai:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                    {/* Left Half Sorted */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-400">
                          Case 1: nums[low] &le; nums[mid]
                        </span>
                        <span className="text-[10px] text-slate-400">LEFT HALF SORTED</span>
                      </div>
                      <p className="text-xs font-sans text-slate-400 leading-relaxed">
                        Range <code className="text-slate-200">[low ... mid]</code> is monotonically increasing.
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#060910] border border-slate-800/80 text-[11px] text-slate-300 font-mono">
                        Target in bounds (nums[low] &le; target &lt; nums[mid])?
                        <br />
                        &rarr; <span className="text-emerald-400">high = mid - 1</span>
                        <br />
                        Else &rarr; <span className="text-slate-400">low = mid + 1</span>
                      </div>
                    </div>

                    {/* Right Half Sorted */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-purple-400">
                          Case 2: nums[mid] &le; nums[high]
                        </span>
                        <span className="text-[10px] text-slate-400">RIGHT HALF SORTED</span>
                      </div>
                      <p className="text-xs font-sans text-slate-400 leading-relaxed">
                        Range <code className="text-slate-200">[mid ... high]</code> is monotonically increasing.
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#060910] border border-slate-800/80 text-[11px] text-slate-300 font-mono">
                        Target in bounds (nums[mid] &lt; target &le; nums[high])?
                        <br />
                        &rarr; <span className="text-purple-400">low = mid + 1</span>
                        <br />
                        Else &rarr; <span className="text-slate-400">high = mid - 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Interactive Flow */}
            {activeTab === 'algorithm' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 flex-wrap gap-2">
                  <span className="text-xs font-mono font-medium text-slate-400 px-1">Walkthrough Stages:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visualFlowSteps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInteractiveStep(idx)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                          interactiveStep === idx
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                            : 'bg-slate-900 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                        }`}
                      >
                        Step {idx + 1}: {s.badge}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const step = visualFlowSteps[interactiveStep];
                  return (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-3 font-mono">
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sky-400" />
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>low={step.low}</span>
                          <span>mid={step.mid}</span>
                          <span>high={step.high}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* TAB 4: Mathematical Proof */}
            {activeTab === 'proof' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-3 text-xs text-slate-300">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-sky-400" />
                  Why at least ONE half is ALWAYS sorted in any rotated array
                </h3>
                <div className="space-y-2.5 font-sans leading-relaxed text-slate-300">
                  <p>
                    Rotated array originally strictly increasing tha. Array mein exactly ek single &quot;drop point&quot; (pivot) exist karta hai (e.g. 7 &rarr; 0).
                  </p>
                  <div className="p-3 rounded-lg bg-[#070a12] border border-slate-800/80 font-mono text-[11px] space-y-1 text-slate-300">
                    <div>1. Ek single drop point sirf kisi EK half (Left ya Right) ke andar gir sakta hai.</div>
                    <div>2. Dono halves mein ek sath drop point hona impossible hai.</div>
                    <div>3. Jis half mein drop point nahi hai, wo half 100% strictly sorted rehta hai.</div>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Is property se hum har step par 50% search space discard kar dete hain, guaranteeing strictly <strong>O(log N)</strong> time complexity.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Complexity */}
            {activeTab === 'complexity' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2 font-mono">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Complexity Benchmarks</span>
                  <div className="flex justify-between bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                    <span>Time Complexity:</span>
                    <strong className="text-emerald-400 font-bold">O(log N)</strong>
                  </div>
                  <div className="flex justify-between bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                    <span>Space Complexity:</span>
                    <strong className="text-emerald-400 font-bold">O(1)</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2 font-sans">
                  <span className="text-slate-400 font-mono font-semibold uppercase tracking-wider text-xs">Edge Cases</span>
                  <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-300">
                    <li>Single element (`[1]`, target=0 or 1)</li>
                    <li>Target at boundaries (`nums[0]` or `nums[n-1]`)</li>
                    <li>Unrotated fully sorted array (`[1, 2, 3, 4]`)</li>
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
