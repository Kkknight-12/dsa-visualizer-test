'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Layout,
  Maximize2,
  TrendingUp,
  ChevronDown,
  Droplets,
} from 'lucide-react';
import {
  generateTrappingWaterSteps,
  TRAPPING_WATER_PRESETS,
  TrappingWaterStep,
} from '@/lib/trappingWaterSimulation';
import { TrappingWaterCodeRunner } from '@/components/trapping-water/TrappingWaterCodeRunner';
import { TrappingWaterCanvas } from '@/components/trapping-water/TrappingWaterCanvas';
import { TrappingWaterProblemInfo } from '@/components/trapping-water/TrappingWaterProblemInfo';
import { TrappingWaterExplanationPanel } from '@/components/trapping-water/TrappingWaterExplanationPanel';

export default function TrappingWaterPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(TRAPPING_WATER_PRESETS[0].id);
  const [steps, setSteps] = useState<TrappingWaterStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<'dual' | 'dock'>('dual');

  // Initialize simulation steps on preset change
  useEffect(() => {
    const preset =
      TRAPPING_WATER_PRESETS.find((p) => p.id === selectedPresetId) ||
      TRAPPING_WATER_PRESETS[0];
    const generated = generateTrappingWaterSteps(preset.heights);
    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedPresetId]);

  // Handle Play/Pause Auto Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1200 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const currentStep = steps[currentStepIdx] || steps[0];

  if (!currentStep) return null;

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#070a14] px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Task Tracker</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg">
              <Droplets className="w-4 h-4 text-cyan-400 font-bold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                LeetCode 42: Trapping Rain Water Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                  Single Pass O(N)
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-mono hidden sm:block">
                Two Pointers • LeftMax vs RightMax Invariant • Shiki Tokyo-Night Code Runner
              </p>
            </div>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayoutMode('dual')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
              layoutMode === 'dual'
                ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span className="hidden md:inline">Option 1: Dual-Pane</span>
          </button>
          <button
            onClick={() => setLayoutMode('dock')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
              layoutMode === 'dock'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden md:inline">Option 2: Smart Dock</span>
          </button>
        </div>
      </header>

      {/* 2. Controls Deck (Preset Selector, Playback, Speed, Counter) */}
      <div className="border-b border-slate-800/60 bg-[#0b0f17] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-[57px] z-40">
        {/* Preset Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-mono text-slate-300 font-bold">Terrain Preset:</span>
          <div className="relative">
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 pr-9 text-xs sm:text-sm font-mono font-medium text-slate-100 hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer"
            >
              {TRAPPING_WATER_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Timeline & Speed Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStepIdx >= steps.length - 1}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {([0.5, 1, 2] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded font-bold ${
                  speed === s
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-xs sm:text-sm font-mono text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800">
            Step <strong className="text-cyan-300 font-bold">{currentStepIdx + 1}</strong> / {steps.length}
          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace */}
      <div className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col gap-4">
        {/* PROBLEM STATEMENT & ALGORITHM MASTER GUIDE */}
        <TrappingWaterProblemInfo />

        {layoutMode === 'dual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Code Runner (5 cols) */}
            <div className="lg:col-span-5 min-h-[460px]">
              <TrappingWaterCodeRunner currentStep={currentStep} totalSteps={steps.length} />
            </div>
            {/* Right: 2D Water Elevation Canvas (7 cols) */}
            <div className="lg:col-span-7 min-h-[460px]">
              <TrappingWaterCanvas currentStep={currentStep} />
            </div>
          </div>
        ) : (
          /* Smart Dock Mode */
          <div className="flex flex-col gap-4">
            <div className="min-h-[380px]">
              <TrappingWaterCanvas currentStep={currentStep} />
            </div>
            <div className="min-h-[320px]">
              <TrappingWaterCodeRunner currentStep={currentStep} totalSteps={steps.length} />
            </div>
          </div>
        )}

        {/* 4. Dedicated State Inspector & Explanation Panel */}
        <div className="w-full">
          <TrappingWaterExplanationPanel currentStep={currentStep} totalSteps={steps.length} />
        </div>
      </div>
    </main>
  );
}
