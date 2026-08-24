'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function PlaybackControls() {
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const togglePlay = useSimulationStore((s) => s.togglePlay);
  const nextStep = useSimulationStore((s) => s.nextStep);
  const prevStep = useSimulationStore((s) => s.prevStep);
  const reset = useSimulationStore((s) => s.reset);
  const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
  const currentScenario = useSimulationStore((s) => s.currentScenario);
  const goToStep = useSimulationStore((s) => s.goToStep);
  const playbackSpeed = useSimulationStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useSimulationStore((s) => s.setPlaybackSpeed);

  const totalSteps = currentScenario.steps.length;

  const speeds = [0.5, 1.0, 2.0];

  return (
    <div className="flex flex-col items-center gap-2 pointer-events-auto">
      {/* Step Pills Scrubber */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-lg">
        {currentScenario.steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          return (
            <button
              key={step.stepNumber}
              onClick={() => goToStep(idx)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 scale-105'
                  : isPassed
                  ? 'bg-slate-800 text-sky-400 hover:bg-slate-700'
                  : 'bg-slate-900/60 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{idx + 1}</span>
              <span className="hidden sm:inline text-[9px] max-w-[80px] truncate">{step.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Control Dock */}
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
        {/* Reset */}
        <button
          onClick={reset}
          title="Reset Simulation"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous Step */}
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          title="Previous Step"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-xs shadow-lg transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play Flow</span>
            </>
          )}
        </button>

        {/* Next Step */}
        <button
          onClick={nextStep}
          disabled={currentStepIndex === totalSteps - 1}
          title="Next Step"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                playbackSpeed === s
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
