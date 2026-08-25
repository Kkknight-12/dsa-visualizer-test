'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Layers, ArrowRight, Play, Code2, Binary } from 'lucide-react';

export default function Home() {
  const visualizers = [
    {
      id: 'kadanes',
      title: "LeetCode 53: Maximum Subarray (Kadane's Studio)",
      subtitle: 'Single Pass O(N) • Discard Negative Prefix Sums',
      description: 'Interactive 2D visualization featuring physical FLIP array block motion, Shiki Tokyo-Night code runner, active line centering, and step logic intuition.',
      path: '/kadanes',
      badge: 'PRO VISUALIZER',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Sparkles,
      iconBg: 'from-amber-500 to-orange-600',
    },
    {
      id: 'next-permutation',
      title: 'LeetCode 31: Next Permutation Studio',
      subtitle: 'In-Place O(N) • 3-Step Lexicographical Swap & Reverse',
      description: 'Step-by-step pivot breakpoint scan, just-greater swapper, and suffix reversal animation on FLIP array rail.',
      path: '/next-permutation',
      badge: 'LEXICOGRAPHICAL',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Sparkles,
      iconBg: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'sort-colors',
      title: 'LeetCode 75: Sort Colors (Dutch National Flag)',
      subtitle: 'Three Pointers • In-Place O(N) Swap',
      description: 'Step-by-step 3-way partitioning animation using low, mid, and high pointers on reusable FLIP array rail.',
      path: '/sort-colors',
      badge: '2D RAIL',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: Code2,
      iconBg: 'from-sky-500 to-blue-600',
    },
    {
      id: 'postorder',
      title: 'Binary Tree Postorder Traversal',
      subtitle: 'Recursion & Call Stack • 2D Tree Graph',
      description: 'Visual stack frame execution tracking Left -> Right -> Root node processing with real-time call stack inspect.',
      path: '/postorder',
      badge: 'TREE GRAPH',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Binary,
      iconBg: 'from-purple-500 to-pink-600',
    },
    {
      id: 'tracker',
      title: 'DSA & System Design Task Tracker',
      subtitle: 'Progress Roadmap • LeetCode Problem Sets',
      description: 'Track completed problems, problem statements, Hinglish notes, and optimal time/space complexity benchmarks.',
      path: '/tracker',
      badge: 'ROADMAP',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Layers,
      iconBg: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 font-sans select-none antialiased flex flex-col">
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#090d13]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              DSA & System Design Visualizer Studio
              <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded-md font-semibold">
                2D STUDIO
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              High-performance 2D/SVG interactive visualizers with Shiki Code Runner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>Task Tracker 📋</span>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 pt-12 pb-8 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive 2D DSA Visualizer Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
          Master Data Structures & Algorithms with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">Step-by-Step 2D Visualizers</span>
        </h2>
        <p className="mt-3 text-sm text-slate-400 max-w-xl font-sans leading-relaxed">
          Clean, lightweight, and high-performance algorithm playthroughs paired with line-by-line code runners and Hinglish step logic explanations.
        </p>
      </section>

      {/* 3. Visualizers Grid */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {visualizers.map((vis) => {
          const Icon = vis.icon;
          return (
            <Link
              key={vis.id}
              href={vis.path}
              className="group relative p-6 rounded-2xl bg-[#0d1117] border border-slate-800/90 hover:border-sky-500/50 transition-all duration-200 flex flex-col justify-between shadow-xl hover:shadow-sky-500/5 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${vis.iconBg} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${vis.badgeColor}`}>
                    {vis.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
                  {vis.title}
                </h3>
                <p className="text-xs font-mono text-sky-400/90 mt-1">
                  {vis.subtitle}
                </p>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  {vis.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-sky-400 group-hover:text-sky-300">
                <span className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Open Studio Visualizer
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
