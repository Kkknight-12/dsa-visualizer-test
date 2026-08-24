'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitBranch, Layers, Sparkles, HelpCircle } from 'lucide-react';
import { TREE_PRESETS, generatePostorderSteps } from '@/lib/treeSimulation';
import { TreeCanvas } from '@/components/tree-traversal/TreeCanvas';
import { StackVisualizer } from '@/components/tree-traversal/StackVisualizer';
import { CodeViewer } from '@/components/tree-traversal/CodeViewer';
import { TreeNarration } from '@/components/tree-traversal/TreeNarration';
import { ResultArrayVisualizer } from '@/components/tree-traversal/ResultArrayVisualizer';
import { TreeControls } from '@/components/tree-traversal/TreeControls';

export default function PostorderVisualizerPage() {
  const [selectedPreset, setSelectedPreset] = useState(TREE_PRESETS[0]);
  const [steps, setSteps] = useState(() => generatePostorderSteps(TREE_PRESETS[0].root));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // When preset changes, regenerate steps
  const handleSelectPreset = (preset: typeof TREE_PRESETS[0]) => {
    setSelectedPreset(preset);
    const newSteps = generatePostorderSteps(preset.root);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep.actionType === 'complete';

  // Playback timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1400 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

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
    <main className="min-h-screen bg-[#05070e] text-slate-100 p-4 md:p-6 flex flex-col gap-5 overflow-y-auto">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>3D System Architecture</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Binary Tree Postorder Traversal
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Phase-Based Stack Algorithm
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Visualizing the LIFO reverse-order scheduling state machine
            </p>
          </div>
        </div>

        {/* Quick Rule Tag */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Execution: <strong className="text-sky-300">LEFT</strong> → <strong className="text-purple-300">RIGHT</strong> → <strong className="text-emerald-300">ROOT</strong></span>
        </div>
      </header>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Column: Tree Canvas + Code Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <TreeCanvas root={selectedPreset.root} currentStep={currentStep} />
          <CodeViewer activeLine={currentStep.activeLine} />
        </div>

        {/* Right Column: Stack Visualizer + Narration */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <StackVisualizer currentStep={currentStep} />
          <TreeNarration currentStep={currentStep} totalSteps={steps.length} />
        </div>
      </div>

      {/* Result Array Visualizer */}
      <ResultArrayVisualizer result={currentStep.resultSnapshot} isComplete={isComplete} />

      {/* Bottom Sticky Controls */}
      <div className="sticky bottom-2 z-30">
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
    </main>
  );
}
