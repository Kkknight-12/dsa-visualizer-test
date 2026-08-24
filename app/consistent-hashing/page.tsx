'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Database, Terminal, Activity } from 'lucide-react';
import { ConsistentHashingEngine } from '@/ConsistentHashing';
import { HashControls } from '@/components/consistent-hashing/HashControls';
import { ReelModeOverlay } from '@/components/consistent-hashing/ReelModeOverlay';

const ConsistentHashingCanvas = dynamic(
  () => import('@/components/consistent-hashing/ConsistentHashingCanvas').then((mod) => mod.ConsistentHashingCanvas),
  { ssr: false }
);

const SAMPLE_KEYS = [
  'user:101',
  'user:102',
  'video:404',
  'session:abc',
  'order:999',
  'cache:profile',
  'auth:jwt_token',
  'feed:explore',
];

export default function ConsistentHashingPage() {
  const [replicas, setReplicas] = useState(3);
  const [hasServerD, setHasServerD] = useState(false);
  const [showVNodes, setShowVNodes] = useState(true);
  const [isReelMode, setIsReelMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeNarrative, setActiveNarrative] = useState(
    'Consistent Hashing Ring initialized with 3 Cache Servers (Node A, B, C).'
  );

  // Initialize Hash Ring
  const ring = useMemo(() => {
    const r = new ConsistentHashingEngine.ConsistentHashRing(replicas);
    r.addServer({ id: 'server-A', label: 'Node A (Cyan)', color: '#06b6d4', ip: '10.0.0.1' });
    r.addServer({ id: 'server-B', label: 'Node B (Emerald)', color: '#10b981', ip: '10.0.0.2' });
    r.addServer({ id: 'server-C', label: 'Node C (Purple)', color: '#8b5cf6', ip: '10.0.0.3' });
    if (hasServerD) {
      r.addServer({ id: 'server-D', label: 'Node D (Amber)', color: '#f59e0b', ip: '10.0.0.4' });
    }
    return r;
  }, [replicas, hasServerD]);

  // Key tracking & migration
  const [activeKey, setActiveKey] = useState<{
    key: string;
    hash: number;
    serverId: string;
    serverColor: string;
    serverAngle: number;
    angleRad: number;
  } | null>(null);

  const [migratingKeys, setMigratingKeys] = useState<
    { key: string; fromServerId: string; toServerId: string; fromAngle: number; toAngle: number }[]
  >([]);

  const [keyIndex, setKeyIndex] = useState(0);

  // 1. Inject Key with 3D CatmullRom Spline Arc
  const handleInjectKey = useCallback(() => {
    const keyName = SAMPLE_KEYS[keyIndex % SAMPLE_KEYS.length];
    setKeyIndex((prev) => prev + 1);

    const match = ring.getServer(keyName);
    if (!match) return;

    const fraction = match.hash / 4294967295;
    const angleRad = fraction * 2 * Math.PI;

    // Server angle
    const serverHash = ConsistentHashingEngine.hashKey(match.server.id);
    const serverFraction = serverHash / 4294967295;
    const serverAngle = serverFraction * 2 * Math.PI;

    setActiveKey({
      key: keyName,
      hash: match.hash,
      serverId: match.server.id,
      serverColor: match.server.color,
      serverAngle,
      angleRad,
    });

    setStepIndex((prev) => prev + 1);
    setActiveNarrative(
      `Key "${keyName}" (hash: ${match.hash}) mapped clockwise to ${match.server.label} via V-Node ${match.vnode.vnodeKey}`
    );
  }, [ring, keyIndex]);

  // 2. Add Server D (Scale-Out with 3D Spline Migration)
  const handleAddServerD = useCallback(() => {
    if (!hasServerD) {
      setHasServerD(true);
      setStepIndex((prev) => prev + 1);
      setActiveNarrative(
        '🚀 Server D Added! Only keys in Server D\'s arc (K/N ≈ 25%) migrate along 3D splines. 75% keys remain untouched!'
      );

      // Trigger visual migration splines
      setMigratingKeys([
        {
          key: 'user:101',
          fromServerId: 'server-A',
          toServerId: 'server-D',
          fromAngle: 0.8,
          toAngle: 2.4,
        },
        {
          key: 'session:abc',
          fromServerId: 'server-C',
          toServerId: 'server-D',
          fromAngle: 4.2,
          toAngle: 2.4,
        },
      ]);

      setTimeout(() => setMigratingKeys([]), 8000);
    }
  }, [hasServerD]);

  // 3. Simulate Server Failover
  const handleCrashServer = useCallback(() => {
    setStepIndex((prev) => prev + 1);
    setActiveNarrative(
      '💥 Simulating Server Failover! Traffic automatically falls over to the next clockwise active node with 0 downtime.'
    );
  }, []);

  const handleReset = useCallback(() => {
    setHasServerD(false);
    setActiveKey(null);
    setMigratingKeys([]);
    setStepIndex(0);
    setActiveNarrative('Consistent Hashing Cluster reset to default 3 servers.');
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070e] text-slate-100 select-none">
      {/* 1. Fullscreen 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <ConsistentHashingCanvas
          ring={ring}
          activeKey={activeKey}
          migratingKeys={migratingKeys}
          showVNodes={showVNodes}
          onKeyArrival={() => {}}
        />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-xl shadow-2xl">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              Consistent Hashing & Virtual Nodes
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                3D WebGL + Splines
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Ring Space: 0 to 2^32 - 1 • Clockwise O(log N) Binary Search
            </p>
          </div>
        </div>

        {/* Navigation Switchers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/postorder"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-xs font-mono text-purple-300 hover:bg-purple-500/30 backdrop-blur-xl transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Postorder Visualizer</span>
          </Link>
        </div>
      </header>

      {/* 3. Left Side Panel: Explanation & Intuition */}
      <aside className="absolute top-20 left-6 z-20 w-80 max-w-full flex flex-col gap-3 pointer-events-none">
        {/* Ring Status Card */}
        <div className="bg-slate-950/85 border border-slate-800/90 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-3 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" /> Ring Topology
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {ring.getServers().length} Servers ({ring.getRingTopology().length} V-Nodes)
            </span>
          </div>

          <div className="text-xs text-slate-300 font-sans leading-relaxed">
            {activeNarrative}
          </div>

          {/* Core Intuition Box */}
          <div className="bg-sky-500/10 border border-sky-500/25 p-2.5 rounded-xl text-[11px] text-sky-200/90">
            <strong className="text-sky-300 font-semibold block mb-0.5">💡 The K/N Scaling Superpower:</strong>
            Traditional <code className="text-amber-300">hash(k) % N</code> moves 100% of keys on server addition. Consistent Hashing moves only <code className="text-emerald-300">K/N keys</code>!
          </div>
        </div>
      </aside>

      {/* 4. Right Side Panel: Live Key Mapping Telemetry */}
      <aside className="absolute top-20 right-6 z-20 w-72 max-w-full flex flex-col gap-3 pointer-events-none">
        <div className="bg-slate-950/85 border border-slate-800/90 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-2.5 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Key Routing
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              FNV-1a 32-bit
            </span>
          </div>

          {activeKey ? (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Active Key:</span>
                <span className="text-amber-300 font-bold">{activeKey.key}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hash Value:</span>
                <span className="text-slate-200">{activeKey.hash}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Server:</span>
                <span style={{ color: activeKey.serverColor }} className="font-bold">
                  {activeKey.serverId}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono text-slate-500 italic">
              Click &quot;Inject Key&quot; below to launch a 3D spline packet.
            </p>
          )}

          {/* Minimal Key Migration Stat */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Redistribution Rate:</span>
            <span className="text-emerald-400 font-bold">~25% (Minimal)</span>
          </div>
        </div>
      </aside>

      {/* 5. Bottom Interactive Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <HashControls
          onInjectKey={handleInjectKey}
          onAddServerD={handleAddServerD}
          onCrashServer={handleCrashServer}
          onToggleVNodes={() => setShowVNodes(!showVNodes)}
          onToggleReelMode={() => setIsReelMode(!isReelMode)}
          onReset={handleReset}
          hasServerD={hasServerD}
          showVNodes={showVNodes}
          isReelMode={isReelMode}
        />
      </div>

      {/* 6. Cinematic Reel Mode Overlay (9:16 Kinetic Video Player) */}
      <ReelModeOverlay
        isReelMode={isReelMode}
        onToggleReelMode={() => setIsReelMode(false)}
        activeNarrative={activeNarrative}
        stepIndex={stepIndex}
      />
    </main>
  );
}
