'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Columns2,
  Zap,
  LayoutGrid,
  Code2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { TREE_PRESETS, generatePostorderSteps } from '@/lib/treeSimulation';
import { AnimatedTreeMotion } from '@/components/postorder-animated/AnimatedTreeMotion';
import { AnimatedStackMotion } from '@/components/postorder-animated/AnimatedStackMotion';
import { PhaseTransformationEngine } from '@/components/postorder-animated/PhaseTransformationEngine';
import { DataFlowPipeline } from '@/components/postorder-animated/DataFlowPipeline';
import { ShikiCodeRunner } from '@/components/postorder-animated/ShikiCodeRunner';
import { AnimatedResultMotion } from '@/components/postorder-animated/AnimatedResultMotion';
import { PostorderExplanationPanel } from '@/components/postorder-animated/PostorderExplanationPanel';
import { PostorderProblemInfo } from '@/components/postorder-animated/PostorderProblemInfo';
import { TreeControls } from '@/components/tree-traversal/TreeControls';

type LayoutMode = 'dual-pane' | 'smart-dock' | 'classic';

export default function Postorder3DPage() {
  const [selectedPreset, setSelectedPreset] = useState(TREE_PRESETS[0]);
  const [steps, setSteps] = useState(() => generatePostorderSteps(TREE_PRESETS[0].root));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dual-pane');

  const handleSelectPreset = (preset: typeof TREE_PRESETS[0]) => {
    setSelectedPreset(preset);
    const newSteps = generatePostorderSteps(preset.root);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep.actionType === 'complete';
  const isExpandPhase =
    currentStep.actionType === 'push_visit' ||
    currentStep.actionType === 'push_right' ||
    currentStep.actionType === 'push_left' ||
    (currentStep.actionType === 'pop' && currentStep.poppedFrame?.phase === 'expand');

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

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans overflow-x-hidden">
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
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 text-purple-400 font-bold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Binary Tree Postorder Traversal Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">
                  Left → Right → Root
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-mono hidden sm:block">
                Synchronized Shiki Code Runner • LIFO Call Stack Frame Visualizer • Hinglish Step Logic
              </p>
            </div>
          </div>
        </div>

        {/* Layout Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setLayoutMode('dual-pane')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                layoutMode === 'dual-pane'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Option 1: Dual-Pane Studio</span>
            </button>

            <button
              onClick={() => setLayoutMode('smart-dock')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                layoutMode === 'smart-dock'
                  ? 'bg-purple-500 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Option 2: Smart Action Dock</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono text-slate-300">
            <span>Step</span>
            <strong className="text-sky-300 font-bold">{currentStep.stepNumber}</strong>
            <span className="text-slate-500">/</span>
            <span>{steps.length}</span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Control Deck (Top Controls Bar) */}
      <div className="border-b border-slate-800/60 bg-[#0b0f17] px-4 py-2.5 sticky top-[57px] z-40">
        <TreeControls
          currentPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNextStep={handleNext}
          onPrevStep={handlePrev}
          onReset={handleReset}
          onGoToStep={(idx) => setCurrentStepIndex(idx)}
          speed={playbackSpeed}
          onSetSpeed={setPlaybackSpeed}
        />
      </div>

      {/* 3. Main Studio Workspace */}
      <div className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col gap-5">
        {/* PROBLEM STATEMENT & ALGORITHM MASTER GUIDE */}
        <PostorderProblemInfo />

        {/* DUAL-PANE STUDIO LAYOUT */}
        {layoutMode === 'dual-pane' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Shiki Code Runner + Step Explanation & Core DSA Logic Panel */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Algorithm Execution & Code Runner
                </span>
              </div>

              {/* 1. Shiki TypeScript Runner */}
              <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />

              {/* 2. Step Explanation & Core DSA Logic Panel (Placed Under Code Editor) */}
              <PostorderExplanationPanel currentStep={currentStep} totalSteps={steps.length} />
            </div>

            {/* RIGHT COLUMN: Visual Canvas (Tree + Stack + Pipelines + Result Array) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Live Data Structures & Dynamic Workstation
                </span>
              </div>

              {/* 1. Tree & Stack Sub-Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 min-h-[380px]">
                  <AnimatedTreeMotion root={selectedPreset.root} currentStep={currentStep} />
                </div>
                <div className="md:col-span-5 min-h-[380px]">
                  <AnimatedStackMotion currentStep={currentStep} />
                </div>
              </div>

              {/* 2. Dynamic Workstation (Phase Morphing & DataFlow Pipeline) */}
              <PhaseTransformationEngine currentStep={currentStep} />
              <DataFlowPipeline currentStep={currentStep} />

              {/* 3. Expanding Result Buffer (Last Section on Right Side under DataFlow Pipeline) */}
              <AnimatedResultMotion
                result={currentStep.resultSnapshot}
                isComplete={isComplete}
                totalNodes={steps[steps.length - 1].resultSnapshot.length}
              />
            </div>
          </div>
        )}

        {/* SMART ACTION DOCK LAYOUT */}
        {layoutMode === 'smart-dock' && (
          <div className="flex flex-col gap-5">
            {/* Row 1: Primary Data Structures (Tree & Stack) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 min-h-[420px]">
                <AnimatedTreeMotion root={selectedPreset.root} currentStep={currentStep} />
              </div>
              <div className="lg:col-span-5 min-h-[420px]">
                <AnimatedStackMotion currentStep={currentStep} />
              </div>
            </div>

            {/* Row 2: Context-Aware Smart Action Dock */}
            <section className="p-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-sky-500/20 to-emerald-500/20 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-mono border-b border-slate-800/80 bg-slate-950/80 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-bold text-slate-200 uppercase">
                    Active Context Dock:{' '}
                    {isExpandPhase ? (
                      <span className="text-amber-400">Reverse LIFO Scheduling Engine ('expand' phase)</span>
                    ) : (
                      <span className="text-emerald-400">Data-Flow Value Transfer Pipeline ('visit' phase)</span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Auto-Switches on Action</span>
              </div>

              <div className="p-2 bg-slate-950/90 rounded-b-xl">
                {isExpandPhase ? (
                  <PhaseTransformationEngine currentStep={currentStep} />
                ) : (
                  <DataFlowPipeline currentStep={currentStep} />
                )}
              </div>
            </section>

            {/* Row 3: Code Runner & Explanation (Left) + Expanding Result Array (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />
                <PostorderExplanationPanel currentStep={currentStep} totalSteps={steps.length} />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-start">
                <AnimatedResultMotion
                  result={currentStep.resultSnapshot}
                  isComplete={isComplete}
                  totalNodes={steps[steps.length - 1].resultSnapshot.length}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
