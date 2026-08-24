'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GitBranch,
  Layers,
  LayoutGrid,
  Columns2,
  Sparkles,
  Zap,
  Code2,
  ListOrdered
} from 'lucide-react';
import { TREE_PRESETS, generatePostorderSteps } from '@/lib/treeSimulation';
import { AnimatedTreeMotion } from '@/components/postorder-animated/AnimatedTreeMotion';
import { AnimatedStackMotion } from '@/components/postorder-animated/AnimatedStackMotion';
import { PhaseTransformationEngine } from '@/components/postorder-animated/PhaseTransformationEngine';
import { DataFlowPipeline } from '@/components/postorder-animated/DataFlowPipeline';
import { ShikiCodeRunner } from '@/components/postorder-animated/ShikiCodeRunner';
import { AnimatedResultMotion } from '@/components/postorder-animated/AnimatedResultMotion';
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
      } else if (e.code === 'Digit1') {
        setLayoutMode('dual-pane');
      } else if (e.code === 'Digit2') {
        setLayoutMode('smart-dock');
      } else if (e.code === 'Digit3') {
        setLayoutMode('classic');
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
    <main className="min-h-screen bg-[#05070e] text-slate-100 p-4 md:p-6 flex flex-col gap-5 overflow-y-auto pb-20">
      {/* 1. Header Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Postorder Traversal — Interactive Algorithm Studio
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Shiki Tokyo-Night & Live Motion Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Synchronized Code Runner • Phase Morphing Engine • Value Transfer Pipeline
            </p>
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

            <button
              onClick={() => setLayoutMode('classic')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                layoutMode === 'classic'
                  ? 'bg-slate-700 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Classic</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            <span className="text-sky-400 font-bold">Step {currentStep.stepNumber}</span>
            <span className="text-slate-500">/</span>
            <span>{steps.length}</span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Control Deck (Top Toolbar — Zero Overlay Conflicts) */}
      <section className="bg-slate-900/50 p-2 rounded-2xl border border-slate-800/80">
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
      </section>

      {/* ========================================================================= */}
      {/* LAYOUT OPTION 1: SIDE-BY-SIDE DUAL-PANE STUDIO                            */}
      {/* ========================================================================= */}
      {layoutMode === 'dual-pane' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Shiki Code Runner + Result Buffer (Sticky Algorithmic Focus) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-2 px-1">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Algorithm Execution & Memory Buffer
              </span>
            </div>

            {/* Shiki TypeScript Runner */}
            <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />

            {/* Expanding Result Buffer */}
            <AnimatedResultMotion
              result={currentStep.resultSnapshot}
              isComplete={isComplete}
              totalNodes={steps[steps.length - 1].resultSnapshot.length}
            />
          </div>

          {/* RIGHT COLUMN: Visual Canvas (Tree + Stack + Live Pipelines) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Live Data Structures & Dynamic Workstation
              </span>
            </div>

            {/* Tree & Stack Sub-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 min-h-[380px]">
                <AnimatedTreeMotion root={selectedPreset.root} currentStep={currentStep} />
              </div>
              <div className="md:col-span-5 min-h-[380px]">
                <AnimatedStackMotion currentStep={currentStep} />
              </div>
            </div>

            {/* Dynamic Workstation (Phase Morphing & DataFlow) */}
            <PhaseTransformationEngine currentStep={currentStep} />
            <DataFlowPipeline currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYOUT OPTION 2: CONTEXT-AWARE SMART ACTION DOCK                          */}
      {/* ========================================================================= */}
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

          {/* Row 2: Context-Aware Smart Action Dock (Automatically switches based on Step) */}
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

          {/* Row 3: Code Runner & Output Array side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />
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

      {/* ========================================================================= */}
      {/* CLASSIC WORKBENCH LAYOUT                                                  */}
      {/* ========================================================================= */}
      {layoutMode === 'classic' && (
        <div className="flex flex-col gap-5">
          {/* Row 1: Tree + Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 min-h-[460px]">
              <AnimatedTreeMotion root={selectedPreset.root} currentStep={currentStep} />
            </div>
            <div className="lg:col-span-5 min-h-[460px]">
              <AnimatedStackMotion currentStep={currentStep} />
            </div>
          </div>

          {/* Row 2: Phase Morphing Engine */}
          <PhaseTransformationEngine currentStep={currentStep} />

          {/* Row 3: DataFlow + Shiki Code Runner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6">
              <DataFlowPipeline currentStep={currentStep} />
            </div>
            <div className="lg:col-span-6">
              <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />
            </div>
          </div>

          {/* Row 4: Expanding Result Array */}
          <AnimatedResultMotion
            result={currentStep.resultSnapshot}
            isComplete={isComplete}
            totalNodes={steps[steps.length - 1].resultSnapshot.length}
          />
        </div>
      )}
    </main>
  );
}
