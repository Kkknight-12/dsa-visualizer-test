'use client';

import React, { useState } from 'react';
import { Database, Radio, ShieldAlert, Binary, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function ScenarioSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const scenarios = useSimulationStore((s) => s.scenarios);
  const currentScenario = useSimulationStore((s) => s.currentScenario);
  const setScenario = useSimulationStore((s) => s.setScenario);

  const getIcon = (id: string) => {
    switch (id) {
      case 'redis-cache-flow':
        return <Database className="w-4 h-4 text-rose-400" />;
      case 'kafka-event-driven':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'rate-limiter-token-bucket':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'lru-cache-dsa':
        return <Binary className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative pointer-events-auto">
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-200 backdrop-blur-xl shadow-2xl transition-all"
      >
        <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
          {getIcon(currentScenario.id)}
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase font-mono text-slate-400">Current Architecture</p>
          <p className="text-xs font-semibold text-white truncate max-w-[170px]">{currentScenario.name}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-950/95 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
            <p className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Select Architecture Flow
            </p>
          </div>

          {scenarios.map((sc) => {
            const isSelected = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setScenario(sc.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                    : 'hover:bg-slate-900 border border-transparent text-slate-300'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                  {getIcon(sc.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-100 truncate">{sc.name}</p>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sc.summary}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {sc.category}
                    </span>
                    <span className="text-[9px] font-mono text-sky-400">
                      {sc.steps.length} Steps
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
