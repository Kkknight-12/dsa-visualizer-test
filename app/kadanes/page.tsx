'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ChevronDown,
  Layout,
  Maximize2,
  Minimize2,
  TrendingUp,
} from 'lucide-react';
import {
  generateKadanesSteps,
  KADANES_PRESETS,
  KadanesStep,
} from '@/lib/kadanesSimulation';
import { KadanesCodeRunner } from '@/components/kadanes/KadanesCodeRunner';
import { KadanesVisualizerCanvas } from '@/components/kadanes/KadanesVisualizerCanvas';
import { KadanesExplanationPanel } from '@/components/kadanes/KadanesExplanationPanel';

export default function KadanesStudioPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(KADANES_PRESETS[0].id);
  const [steps, setSteps] = useState<KadanesStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 0.5 | 2>(1);
  const [layoutMode, setLayoutMode] = useState<'dual' | 'dock'>('dual');

  const currentPreset =
    KADANES_PRESETS.find((p) => p.id === selectedPresetId) || KADANES_PRESETS[0];

  // Initialize simulation steps on preset change
  useEffect(() => {
    const generatedSteps = generateKadanesSteps(currentPreset.initialArray);
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedPresetId]);

  // Autoplay timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const intervalMs = (1000 / speed);
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, speed]);

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (!currentStep) return null;

  return (
    <main className="min-h-screen bg-[#090d13] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0d1117]/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Task Tracker</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-emerald-400 font-bold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                LeetCode 53: Maximum Subarray — Kadane's Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  Single Pass O(N)
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-mono hidden sm:block">
                Greedy Running Sum • Discard Negative Prefix Sums • Shiki Tokyo-Night Code Runner
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

      {/* 2. Top Control Bar (Preset Dropdown, Play/Pause, Speed) */}
      <div className="border-b border-slate-800/60 bg-[#0b0f17] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-[57px] z-40">
        {/* Preset Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-mono text-slate-300 font-bold">Array Preset:</span>
          <div className="relative">
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 pr-9 text-xs sm:text-sm font-mono font-medium text-slate-100 hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors cursor-pointer"
            >
              {KADANES_PRESETS.map((p) => (
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
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStepIndex >= steps.length - 1}
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
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-xs sm:text-sm font-mono text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800">
            Step <strong className="text-sky-300 font-bold">{currentStepIndex + 1}</strong> / {steps.length}
          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace */}
      <div className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col gap-4">
        {layoutMode === 'dual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Code Runner (5 cols) */}
            <div className="lg:col-span-5 min-h-[460px]">
              <KadanesCodeRunner currentStep={currentStep} totalSteps={steps.length} />
            </div>
            {/* Right: Code Visual Block / Array Rail Canvas (7 cols) */}
            <div className="lg:col-span-7 min-h-[460px]">
              <KadanesVisualizerCanvas currentStep={currentStep} />
            </div>
          </div>
        ) : (
          /* Smart Dock Mode */
          <div className="flex flex-col gap-4">
            <div className="min-h-[380px]">
              <KadanesVisualizerCanvas currentStep={currentStep} />
            </div>
            <div className="min-h-[320px]">
              <KadanesCodeRunner currentStep={currentStep} totalSteps={steps.length} />
            </div>
          </div>
        )}

        {/* 4. Dedicated Code Explanation & Core DSA Logic Panel */}
        <div className="w-full">
          <KadanesExplanationPanel currentStep={currentStep} totalSteps={steps.length} />
        </div>
      </div>
    </main>
  );
}
