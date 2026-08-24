'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Layers,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  Zap,
  BookOpen
} from 'lucide-react';
import {
  SORT_COLORS_PRESETS,
  generateSortColorsSteps,
  SortColorsStep
} from '@/lib/sortColorsSimulation';
import { DualPointerRail } from '@/components/sort-colors/DualPointerRail';
import { SortColorsCodeRunner } from '@/components/sort-colors/SortColorsCodeRunner';

export default function SortColorsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(SORT_COLORS_PRESETS[0].id);
  const [steps, setSteps] = useState<SortColorsStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<'dual-pane' | 'smart-dock' | 'classic'>('dual-pane');

  // Initialize steps when preset changes
  useEffect(() => {
    const preset = SORT_COLORS_PRESETS.find((p) => p.id === selectedPresetId) || SORT_COLORS_PRESETS[0];
    const generated = generateSortColorsSteps(preset.initialArray);
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

  const currentStep = steps[currentStepIdx] || steps[0];

  if (!currentStep) return null;

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 p-4 md:p-6 flex flex-col gap-4 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Task Tracker</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              LeetCode 75: Sort Colors — Dutch National Flag Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Single Pass O(N)
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              3 Pointers (low, mid, high) • In-Place Partitioning • Shiki Tokyo-Night Code Runner
            </p>
          </div>
        </div>

        {/* Layout Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setLayoutMode('dual-pane')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              layoutMode === 'dual-pane'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Option 1: Dual-Pane
          </button>
          <button
            onClick={() => setLayoutMode('smart-dock')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              layoutMode === 'smart-dock'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Option 2: Smart Dock
          </button>
        </div>
      </header>

      {/* 2. Controls Deck */}
      <section className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Array Preset:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-sky-500/50 cursor-pointer"
          >
            {SORT_COLORS_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950" />}
            <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx === steps.length - 1}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Step Counter */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  speed === s ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Step <strong className="text-sky-300">{currentStepIdx + 1}</strong> / {steps.length}
          </span>
        </div>
      </section>

      {/* 3. Main Visualizer Grid (Option 1: Dual-Pane Studio Layout) */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Code Runner */}
        <div className="lg:col-span-5 flex flex-col">
          <SortColorsCodeRunner currentStep={currentStep} totalSteps={steps.length} />
        </div>

        {/* Right Column: 2D Dual Pointer Rail */}
        <div className="lg:col-span-7 flex flex-col">
          <DualPointerRail currentStep={currentStep} />
        </div>
      </section>
    </main>
  );
}
