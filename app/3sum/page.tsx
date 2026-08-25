'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  THREE_SUM_PRESETS,
  THREE_SUM_CODE_SNIPPET,
  generateThreeSumSteps,
  ThreeSumStep,
} from '@/lib/threeSumSimulation';
import { ThreeSumProblemInfo } from '@/components/three-sum/ThreeSumProblemInfo';
import { ThreeSumExplanationPanel } from '@/components/three-sum/ThreeSumExplanationPanel';
import { ThreeSumMathStrip } from '@/components/three-sum/ThreeSumMathStrip';
import { ReorderableArrayRail, PointerInfo } from '@/components/common/ReorderableArrayRail';
import { ThreeSumCodeRunner } from '@/components/three-sum/ThreeSumCodeRunner';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Sliders,
  CheckCircle2,
  Sparkles,
  Target,
  Compass,
} from 'lucide-react';

export default function ThreeSumStudioPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(THREE_SUM_PRESETS[0].id);
  const [steps, setSteps] = useState<ThreeSumStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  const currentPreset = THREE_SUM_PRESETS.find((p) => p.id === selectedPresetId) || THREE_SUM_PRESETS[0];

  // Re-generate simulation steps when preset changes
  useEffect(() => {
    const generated = generateThreeSumSteps(currentPreset.initialArray);
    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedPresetId]);

  const currentStep = steps[currentStepIdx] || steps[0];

  // Auto-play timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.max(200, 1200 / speedMultiplier);
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, intervalMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length, speedMultiplier]);

  // Construct pointers array for ReorderableArrayRail with persistent IDs for fluid motion
  const pointers: PointerInfo[] = [];
  if (currentStep && currentStep.actionType !== 'init' && currentStep.actionType !== 'sort') {
    if (currentStep.i >= 0 && currentStep.i < currentStep.arraySnapshot.length) {
      pointers.push({
        id: 'anchor-i',
        label: `i=${currentStep.i}`,
        index: currentStep.i,
        color: 'bg-amber-400 text-slate-950 font-black',
        direction: 'up',
      });
    }
    if (
      currentStep.left >= 0 &&
      currentStep.left < currentStep.arraySnapshot.length &&
      currentStep.left !== currentStep.i
    ) {
      pointers.push({
        id: 'ptr-left',
        label: 'LEFT',
        index: currentStep.left,
        color: 'bg-sky-400 text-slate-950 font-black',
        direction: 'down',
      });
    }
    if (
      currentStep.right >= 0 &&
      currentStep.right < currentStep.arraySnapshot.length &&
      currentStep.right !== currentStep.i &&
      currentStep.right !== currentStep.left
    ) {
      pointers.push({
        id: 'ptr-right',
        label: 'RIGHT',
        index: currentStep.right,
        color: 'bg-purple-400 text-white font-black',
        direction: 'up',
      });
    }
  }

  // Custom Color Config highlighting the 3 actively evaluated terms
  const getThreeSumBlockColor = (val: number, idx: number) => {
    if (currentStep && currentStep.actionType !== 'init' && currentStep.actionType !== 'sort') {
      if (idx === currentStep.i) {
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-400 ring-2 ring-amber-400/50',
          text: 'text-amber-200 font-black',
          label: 'Anchor i',
        };
      }
      if (idx === currentStep.left) {
        return {
          bg: 'bg-sky-500/20',
          border: 'border-sky-400 ring-2 ring-sky-400/50',
          text: 'text-sky-200 font-black',
          label: 'Left',
        };
      }
      if (idx === currentStep.right) {
        return {
          bg: 'bg-purple-500/20',
          border: 'border-purple-400 ring-2 ring-purple-400/50',
          text: 'text-purple-200 font-black',
          label: 'Right',
        };
      }
    }
    return {
      bg: 'bg-slate-900/90',
      border: 'border-slate-800',
      text: 'text-slate-300 font-bold',
      label: '',
    };
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col gap-6 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Header Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Task Tracker</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                LeetCode 15: 3Sum Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  O(N²) Two Pointers
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Sorting + Fixed Anchor i + Dual Scanning Pointers (Left, Right)
              </p>
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400 pl-2">Array Preset:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="bg-slate-950 text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 transition-all"
          >
            {THREE_SUM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 2. Master Problem Info Component (5-Tab Master Guide) */}
      <ThreeSumProblemInfo />

      {/* 3. Playthrough Timeline Controls */}
      <div className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx(0);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 transition-all"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs shadow-lg transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
            }}
            disabled={currentStepIdx === steps.length - 1}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 transition-all"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Step Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  speedMultiplier === s
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            Step <span className="text-amber-400">{currentStepIdx + 1}</span> / {steps.length}
          </div>
        </div>
      </div>

      {/* 4. Standard Dual-Pane Studio Layout (lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-5): Code Runner & Explanation Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Shiki Code Runner */}
          <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl font-sans flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> TypeScript Algorithm Runner
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                Shiki Tokyo-Night
              </span>
            </div>
            <ThreeSumCodeRunner currentStep={currentStep} totalSteps={steps.length} />
          </div>

          {/* Dedicated Explanation Panel */}
          {currentStep && <ThreeSumExplanationPanel currentStep={currentStep} totalSteps={steps.length} />}
        </div>

        {/* Right Column (lg:col-span-7): Reorderable Array Rail & Live Math Strip */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Live Math Strip & Pointer Decision Engine */}
          {currentStep && <ThreeSumMathStrip currentStep={currentStep} />}

          {/* 2. Live Data Structure & Visual Canvas */}
          <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl font-sans flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                  3Sum Dual-Pointer Canvas
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                FLIP Block Motion
              </span>
            </div>

            {/* Reorderable Array Rail */}
            {currentStep && (
              <ReorderableArrayRail
                elements={currentStep.arraySnapshot}
                pointers={pointers}
                swappingIndices={currentStep.swappingIndices}
                getColorConfig={getThreeSumBlockColor}
              />
            )}

            {/* Active Subarray Pointers Status Board */}
            {currentStep && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Anchor i</span>
                  <span className="text-amber-300 font-extrabold text-sm">
                    index [{currentStep.i}] = {currentStep.arraySnapshot[currentStep.i]?.val ?? 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold font-mono">Left Pointer</span>
                  <span className="text-sky-300 font-extrabold text-sm">
                    index [{currentStep.left}] = {currentStep.arraySnapshot[currentStep.left]?.val ?? 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold font-mono">Right Pointer</span>
                  <span className="text-purple-300 font-extrabold text-sm">
                    index [{currentStep.right}] = {currentStep.arraySnapshot[currentStep.right]?.val ?? 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
