'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  ChevronDown,
  Layers,
  Sparkles,
  RefreshCw,
  GitCommit,
  CheckCircle2,
} from 'lucide-react';
import {
  NEXT_PERMUTATION_PRESETS,
  generateNextPermutationSteps,
  NextPermutationStep,
} from '@/lib/nextPermutationSimulation';
import {
  ReorderableArrayRail,
  ArrayBlockElement,
  PointerInfo,
} from '@/components/common/ReorderableArrayRail';
import { NextPermutationCodeRunner } from '@/components/next-permutation/NextPermutationCodeRunner';
import { NextPermutationExplanationPanel } from '@/components/next-permutation/NextPermutationExplanationPanel';
import { NextPermutationProblemInfo } from '@/components/next-permutation/NextPermutationProblemInfo';

export default function NextPermutationPage() {
  const [selectedPreset, setSelectedPreset] = useState(NEXT_PERMUTATION_PRESETS[0]);
  const [steps, setSteps] = useState<NextPermutationStep[]>(() =>
    generateNextPermutationSteps(NEXT_PERMUTATION_PRESETS[0].nums)
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Persistent element IDs for FLIP physical sliding animations
  const [elementIds, setElementIds] = useState<string[]>(() =>
    selectedPreset.nums.map((_, idx) => `elem-${idx}`)
  );

  const handleSelectPreset = (preset: typeof NEXT_PERMUTATION_PRESETS[0]) => {
    setSelectedPreset(preset);
    const newSteps = generateNextPermutationSteps(preset.nums);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setElementIds(preset.nums.map((_, idx) => `elem-${idx}`));
  };

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1500 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setCurrentStepIndex(0);
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Prepare ArrayBlockElement array directly from currentStep's persistent arraySnapshot
  const railElements: ArrayBlockElement[] = currentStep.arraySnapshot;

  // Dynamic Pointers for ReorderableArrayRail
  const pointers: PointerInfo[] = useMemo(() => {
    const list: PointerInfo[] = [];

    if (currentStep.pivotIndex !== null) {
      list.push({
        id: 'pivot',
        label: `pivot (i=${currentStep.pivotIndex})`,
        index: currentStep.pivotIndex,
        color: 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold',
        direction: 'up',
      });
    }

    if (currentStep.swapIndex !== null) {
      list.push({
        id: 'swapper',
        label: `swapper (j=${currentStep.swapIndex})`,
        index: currentStep.swapIndex,
        color: 'bg-sky-500 border-sky-400 text-slate-950 font-extrabold',
        direction: 'down',
      });
    }

    if (
      currentStep.scanningIndex !== null &&
      currentStep.scanningIndex !== currentStep.pivotIndex &&
      currentStep.scanningIndex !== currentStep.swapIndex
    ) {
      list.push({
        id: 'scan',
        label: `scan (${currentStep.scanningIndex})`,
        index: currentStep.scanningIndex,
        color: 'bg-purple-500 border-purple-400 text-white font-bold',
        direction: 'down',
      });
    }

    return list;
  }, [currentStep]);

  // Color theme generator for array block elements
  const getColorConfig = (val: number) => {
    return {
      bg: 'bg-slate-900/90',
      border: 'border-slate-700',
      text: 'text-amber-300 font-mono font-black',
      label: `Val: ${val}`,
    };
  };

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#070a14] px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Task Tracker</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <RefreshCw className="w-4 h-4 text-amber-400 font-bold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                LeetCode 31: Next Permutation Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  In-Place O(N)
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-mono hidden sm:block">
                3-Step Lexicographical Pivot • Suffix Swapper • In-Place Reversal
              </p>
            </div>
          </div>
        </div>

        {/* Right Info Badge */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono text-slate-300">
          <span>Step</span>
          <strong className="text-sky-300 font-bold">{currentStep.stepNumber}</strong>
          <span className="text-slate-500">/</span>
          <span>{steps.length}</span>
        </div>
      </header>

      {/* 2. Controls & Preset Toolbar */}
      <div className="border-b border-slate-800/60 bg-[#0b0f17] px-4 py-2.5 sticky top-[57px] z-40 flex flex-wrap items-center justify-between gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">Preset:</span>
          <div className="relative">
            <select
              value={selectedPreset.id}
              onChange={(e) => {
                const found = NEXT_PERMUTATION_PRESETS.find((p) => p.id === e.target.value);
                if (found) handleSelectPreset(found);
              }}
              className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-mono py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              {NEXT_PERMUTATION_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono ml-2">
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded ${
                  playbackSpeed === spd ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace */}
      <div className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col gap-5">
        {/* PROBLEM STATEMENT & ALGORITHM DEEP-DIVE INFO PANEL */}
        <NextPermutationProblemInfo />

        {/* DUAL-PANE STUDIO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Shiki Code Runner + Step Explanation & Core DSA Logic Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Algorithm Execution & Code Runner
              </span>
            </div>

            {/* 1. Shiki TypeScript Runner */}
            <NextPermutationCodeRunner currentStep={currentStep} totalSteps={steps.length} />

            {/* 2. Step Explanation & Core DSA Logic Panel */}
            <NextPermutationExplanationPanel currentStep={currentStep} totalSteps={steps.length} />
          </div>

          {/* RIGHT COLUMN: Visual Canvas (Array Rail + Telemetry Metrics) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Lexicographical Array Rail Canvas
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">FLIP Physical Motion</span>
            </div>

            {/* Physical Array Block Rail Canvas */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6 items-center justify-center min-h-[360px]">
              <ReorderableArrayRail
                elements={railElements}
                pointers={pointers}
                swappingIndices={currentStep.swappingIndices || undefined}
                highlightedRange={currentStep.reverseRange || undefined}
                getColorConfig={getColorConfig}
              />

              {/* Range & Suffix Highlight Legend */}
              <div className="flex items-center gap-4 text-xs font-mono pt-4 border-t border-slate-800/80 w-full justify-center flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
                  <span className="text-slate-300">Pivot (i)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-500 border border-sky-400" />
                  <span className="text-slate-300">Swapper (j)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
                  <span className="text-slate-300">Reverse Suffix Range</span>
                </div>
              </div>
            </div>

            {/* Telemetry Scoreboard */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-mono text-slate-400 uppercase">Pivot (Index i)</span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  {currentStep.pivotIndex !== null ? `i=${currentStep.pivotIndex} (${currentStep.nums[currentStep.pivotIndex]})` : 'None'}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-mono text-slate-400 uppercase">Swapper (Index j)</span>
                <span className="text-2xl font-black font-mono text-sky-400">
                  {currentStep.swapIndex !== null ? `j=${currentStep.swapIndex} (${currentStep.nums[currentStep.swapIndex]})` : 'None'}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs font-mono text-slate-400 uppercase">Reverse Suffix</span>
                <span className="text-2xl font-black font-mono text-purple-400">
                  {currentStep.reverseRange ? `[${currentStep.reverseRange[0]}...${currentStep.reverseRange[1]}]` : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
