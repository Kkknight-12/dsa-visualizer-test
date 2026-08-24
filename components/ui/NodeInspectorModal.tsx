'use client';

import React from 'react';
import { X, Server, Cpu, HardDrive, Zap, Info, ShieldCheck } from 'lucide-react';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function NodeInspectorModal() {
  const selectedNode = useSimulationStore((s) => s.getSelectedNode());
  const selectNode = useSimulationStore((s) => s.selectNode);

  if (!selectedNode) return null;

  return (
    <div className="absolute top-20 right-6 z-40 w-80 bg-slate-950/95 border border-slate-700/80 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl text-slate-100 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
            <p className="text-[10px] font-mono text-slate-400">{selectedNode.sublabel}</p>
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <div className="py-3 text-xs text-slate-300 leading-relaxed border-b border-slate-800">
        {selectedNode.description}
      </div>

      {/* Live Metrics Grid */}
      <div className="py-3 border-b border-slate-800 space-y-2">
        <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
          Node Telemetry
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {selectedNode.metrics.cpuUsage !== undefined && (
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" /> CPU Load
              </span>
              <p className="font-bold text-sky-300 mt-0.5">{selectedNode.metrics.cpuUsage}%</p>
            </div>
          )}
          {selectedNode.metrics.memoryUsage && (
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-400" /> Memory
              </span>
              <p className="font-bold text-purple-300 mt-0.5">{selectedNode.metrics.memoryUsage}</p>
            </div>
          )}
          {selectedNode.metrics.latencyMs !== undefined && (
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Avg Latency
              </span>
              <p className="font-bold text-amber-300 mt-0.5">{selectedNode.metrics.latencyMs}ms</p>
            </div>
          )}
          {selectedNode.metrics.hitRate !== undefined && (
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Hit Ratio
              </span>
              <p className="font-bold text-emerald-300 mt-0.5">{selectedNode.metrics.hitRate}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      {selectedNode.specs && (
        <div className="pt-3 space-y-1.5">
          <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Architecture Specs
          </p>
          <div className="space-y-1 text-[11px] font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            {Object.entries(selectedNode.specs).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">{k}:</span>
                <span className="text-slate-200 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
