'use client';

import React, { useEffect, useState } from 'react';
import { Video, Volume2, Sparkles, TrendingDown, Eye } from 'lucide-react';

interface ReelModeOverlayProps {
  isReelMode: boolean;
  onToggleReelMode: () => void;
  activeNarrative: string;
  stepIndex: number;
}

const REEL_CAPTIONS = [
  '🔥 Why standard hash(key) % N FAILS at scale...',
  '💥 Adding 1 server causes 100% CACHE MISS & DB CRASH!',
  '⚡ Solution: The Consistent Hashing Ring (0 to 2^32 - 1).',
  '🔑 Keys travel along 3D splines and map CLOCKWISE.',
  '🔮 Virtual Nodes eliminate hot spots and balance traffic perfectly.',
  '🚀 Adding Server D only moved K/N keys (Minimal migration)!',
];

export function ReelModeOverlay({
  isReelMode,
  onToggleReelMode,
  activeNarrative,
  stepIndex,
}: ReelModeOverlayProps) {
  const [currentCaptionIdx, setCurrentCaptionIdx] = useState(0);

  useEffect(() => {
    setCurrentCaptionIdx(stepIndex % REEL_CAPTIONS.length);
  }, [stepIndex]);

  if (!isReelMode) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* 9:16 Vertical Reel Aspect Ratio Crop Borders */}
      <div className="absolute inset-y-0 w-[420px] max-w-full border-x-2 border-dashed border-sky-500/40 shadow-2xl flex flex-col justify-between p-6">
        {/* Top Reel HUD */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-rose-600/90 text-white px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            REC • 60 FPS REEL
          </div>

          <div className="bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-full text-[10px] font-mono text-sky-400 flex items-center gap-1.5 backdrop-blur-xl">
            <Volume2 className="w-3 h-3 text-sky-400" />
            <span>ElevenLabs Voiceover SFX</span>
          </div>
        </div>

        {/* Minimal Redistribution Metric Callout */}
        <div className="self-center bg-slate-950/90 border border-emerald-500/60 p-3 rounded-2xl shadow-2xl backdrop-blur-2xl text-center space-y-1 animate-bounce">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Key Redistribution Rate</p>
          <p className="text-xl font-mono font-extrabold text-emerald-400">
            K / N ≈ 25% <span className="text-xs text-slate-300 font-normal">(vs 100% Naive Modulo)</span>
          </p>
        </div>

        {/* Kinetic Word-by-Word Subtitles (Krishna Chaitanya Reel Style) */}
        <div className="bg-slate-950/95 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-3xl text-center shadow-2xl space-y-2 pointer-events-auto">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kinetic Concept Explainer</span>
          </div>

          <p className="text-base font-extrabold text-white leading-snug tracking-tight font-sans">
            {REEL_CAPTIONS[currentCaptionIdx]}
          </p>

          <p className="text-xs text-sky-300/90 font-mono">
            {activeNarrative}
          </p>
        </div>
      </div>
    </div>
  );
}
