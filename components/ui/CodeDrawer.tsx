'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function CodeDrawer() {
  const currentStep = useSimulationStore((s) => s.getCurrentStep());
  const isCodeDrawerOpen = useSimulationStore((s) => s.isCodeDrawerOpen);
  const toggleCodeDrawer = useSimulationStore((s) => s.toggleCodeDrawer);
  const [copied, setCopied] = useState(false);

  const snippet = currentStep?.codeSnippet;
  if (!snippet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pointer-events-auto transition-all duration-300">
      {/* Code Drawer Card */}
      <div className="w-80 lg:w-96 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col">
        {/* Header Tab */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-mono font-medium text-slate-200 truncate">
              {snippet.filename}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
              {snippet.language}
            </span>
          </div>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-3.5 max-h-56 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#030712]/90">
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-sky-200/90 selection:bg-sky-500/30">
            {snippet.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
