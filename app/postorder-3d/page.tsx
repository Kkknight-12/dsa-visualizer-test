'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Box, CheckCircle2, GitBranch, Layers } from 'lucide-react';
import { TREE_PRESETS, generatePostorderSteps } from '@/lib/treeSimulation';
import { AnimatedTreeMotion } from '@/components/postorder-animated/AnimatedTreeMotion';
import { AnimatedStackMotion } from '@/components/postorder-animated/AnimatedStackMotion';
import { PhaseTransformationEngine } from '@/components/postorder-animated/PhaseTransformationEngine';
import { DataFlowPipeline } from '@/components/postorder-animated/DataFlowPipeline';
import { ShikiCodeRunner } from '@/components/postorder-animated/ShikiCodeRunner';
import { AnimatedResultMotion } from '@/components/postorder-animated/AnimatedResultMotion';
import { TreeControls } from '@/components/tree-traversal/TreeControls';

export default function Postorder3DPage() {
  const [selectedPreset, setSelectedPreset] = useState(TREE_PRESETS[0]);
  const [steps, setSteps] = useState(() => generatePostorderSteps(TREE_PRESETS[0].root));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleSelectPreset = (preset: typeof TREE_PRESETS[0]) => {
    setSelectedPreset(preset);
    const newSteps = generatePostorderSteps(preset.root);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep.actionType === 'complete';

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
      // Don't trigger if user is typing in an input
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
                Shiki Code Runner & Live Motion Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Synchronized Shiki TypeScript Runner • Phase Morphing Engine • Value Transfer Pipeline
            </p>
          </div>
        </div>

        {/* Step Indicator & Keyboard Hints */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Space</kbd> Play
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd> Next
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd> Prev
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">R</kbd> Reset
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

      {/* 3. ROW 1: Element 1 (Tree) + Element 2 (Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Element 1 (Tactile 2D Binary Tree) */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Element 1: Binary Tree Topology
            </span>
          </div>
          <div className="min-h-[460px] flex-1">
            <AnimatedTreeMotion root={selectedPreset.root} currentStep={currentStep} />
          </div>
        </div>

        {/* Right Column: Element 2 (Real Array of Objects Stack) */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Element 2: LIFO Array Stack (Objects)
            </span>
          </div>
          <div className="min-h-[460px] flex-1">
            <AnimatedStackMotion currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* 4. ROW 2: Phase Morphing & Reverse Scheduling Engine */}
      <PhaseTransformationEngine currentStep={currentStep} />

      {/* 5. ROW 3: Live DataFlow Pipeline (Left) + Shiki Code Runner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <DataFlowPipeline currentStep={currentStep} />
        </div>
        <div className="lg:col-span-6">
          <ShikiCodeRunner currentStep={currentStep} totalSteps={steps.length} />
        </div>
      </div>

      {/* 6. ROW 4: Expanding Result Array Buffer */}
      <AnimatedResultMotion
        result={currentStep.resultSnapshot}
        isComplete={isComplete}
        totalNodes={steps[steps.length - 1].resultSnapshot.length}
      />
    </main>
  );
}
