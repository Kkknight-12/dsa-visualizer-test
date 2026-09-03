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
  Search,
  ChevronDown,
} from 'lucide-react';
import {
  SEARCH_ROTATED_ARRAY_PRESETS,
  generateSearchRotatedArraySteps,
  SearchRotatedArrayStep,
} from '@/lib/searchRotatedArraySimulation';
import { SearchRotatedArrayCodeRunner } from '@/components/search-rotated-array/SearchRotatedArrayCodeRunner';
import { SearchRotatedArrayCanvas } from '@/components/search-rotated-array/SearchRotatedArrayCanvas';
import { SearchRotatedArrayProblemInfo } from '@/components/search-rotated-array/SearchRotatedArrayProblemInfo';
import { SearchRotatedArrayExplanationPanel } from '@/components/search-rotated-array/SearchRotatedArrayExplanationPanel';

export default function SearchRotatedArrayPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(
    SEARCH_ROTATED_ARRAY_PRESETS[0].id
  );
  const [steps, setSteps] = useState<SearchRotatedArrayStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<'dual' | 'dock'>('dual');

  // Initialize simulation steps on preset change
  useEffect(() => {
    const preset =
      SEARCH_ROTATED_ARRAY_PRESETS.find((p) => p.id === selectedPresetId) ||
      SEARCH_ROTATED_ARRAY_PRESETS[0];
    const generated = generateSearchRotatedArraySteps(preset.array, preset.target);
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
    <main className="min-h-screen bg-[#070a12] text-slate-200 flex flex-col font-sans overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#090d16] px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Task Tracker</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-sky-400 font-bold" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                LeetCode 33: Search in Rotated Sorted Array
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium">
                  O(log N)
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Modified Binary Search • Range Eliminator Slider • Shiki Tokyo-Night
              </p>
            </div>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setLayoutMode('dual')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              layoutMode === 'dual'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dual-Pane</span>
          </button>
          <button
            onClick={() => setLayoutMode('dock')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              layoutMode === 'dock'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Smart Dock</span>
          </button>
        </div>
      </header>

      {/* 2. Controls Deck (Preset Selector, Playback, Speed, Counter) */}
      <div className="border-b border-slate-800/60 bg-[#080c15] px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-[53px] z-40">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Preset:</span>
          <div className="relative">
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 pr-8 text-xs font-mono text-slate-200 hover:border-slate-700 focus:outline-none focus:border-slate-600 transition-colors cursor-pointer"
            >
              {SEARCH_ROTATED_ARRAY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Timeline & Speed Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={handleReset}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStepIdx >= steps.length - 1}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {([0.5, 1, 2] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded ${
                  speed === s
                    ? 'bg-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Counter */}
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            Step <strong className="text-slate-200">{currentStepIdx + 1}</strong> / {steps.length}
          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace */}
      <div className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col gap-4">
        {/* Master Problem Visual Guide */}
        <SearchRotatedArrayProblemInfo />

        {layoutMode === 'dual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Code Runner (5 cols) */}
            <div className="lg:col-span-5 min-h-[460px]">
              <SearchRotatedArrayCodeRunner
                currentStep={currentStep}
                totalSteps={steps.length}
              />
            </div>
            {/* Right: Range Eliminator Canvas (7 cols) */}
            <div className="lg:col-span-7 min-h-[460px]">
              <SearchRotatedArrayCanvas currentStep={currentStep} />
            </div>
          </div>
        ) : (
          /* Smart Dock Mode */
          <div className="flex flex-col gap-4">
            <div className="min-h-[380px]">
              <SearchRotatedArrayCanvas currentStep={currentStep} />
            </div>
            <div className="min-h-[320px]">
              <SearchRotatedArrayCodeRunner
                currentStep={currentStep}
                totalSteps={steps.length}
              />
            </div>
          </div>
        )}

        {/* 4. Dedicated State Inspector & Explanation Panel */}
        <div className="w-full">
          <SearchRotatedArrayExplanationPanel
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        </div>
      </div>
    </main>
  );
}
