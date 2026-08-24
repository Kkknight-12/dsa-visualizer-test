'use client';

import React from 'react';
import { Activity, Gauge, Zap, Server } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function MetricsPanel() {
  const currentStep = useSimulationStore((s) => s.getCurrentStep());
  const currentScenario = useSimulationStore((s) => s.currentScenario);

  const latency = currentStep?.latencyMs ?? 0;
  const cumulativeLatency = currentStep?.cumulativeLatencyMs ?? 0;
  const throughput = currentStep?.throughputRps ?? 0;
  const hitRatio = currentStep?.cacheHitRatio ?? 0;

  // Visual latency tier
  const isFast = latency <= 5;
  const isMedium = latency > 5 && latency <= 50;

  return (
    <div className="flex flex-col gap-2.5 pointer-events-auto w-64 bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
            Telemetry & Metrics
          </span>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Live Stream
        </span>
      </div>

      {/* Latency Gauge */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-500" /> Step Latency
          </span>
          <span
            className={`font-mono font-bold ${
              isFast ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {latency.toFixed(1)} ms
          </span>
        </div>

        {/* Latency Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFast
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : isMedium
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-600 to-red-500'
            }`}
            style={{ width: `${Math.min(Math.max((latency / 100) * 100, 4), 100)}%` }}
          />
        </div>
      </div>

      {/* Grid of Micro Metrics */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Cumulative Time */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-2 rounded-xl">
          <p className="text-[10px] text-slate-400 font-mono">Total Time</p>
          <p className="text-xs font-bold text-slate-100 font-mono mt-0.5">
            {cumulativeLatency.toFixed(1)}ms
          </p>
        </div>

        {/* Throughput */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-2 rounded-xl">
          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" /> QPS / Throughput
          </p>
          <p className="text-xs font-bold text-sky-400 font-mono mt-0.5">
            {throughput.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">req/s</span>
          </p>
        </div>
      </div>

      {/* Active Path Badge */}
      {currentStep?.activePath && (
        <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">Active Packet:</span>
          <span className="text-sky-300 font-semibold truncate max-w-[120px]">
            {currentStep.activePath.packetType.replace('_', ' ')}
          </span>
        </div>
      )}
    </div>
  );
}
