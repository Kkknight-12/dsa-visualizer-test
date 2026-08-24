'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  PlayCircle,
  Code2,
  Sparkles,
  Layers,
  BarChart2,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Filter,
  Check,
  Zap,
  Rocket
} from 'lucide-react';
import { STRIVER_A2Z_PROBLEMS, DSAProblemTask } from '@/lib/trackerData';

export default function TrackerPage() {
  const [problems, setProblems] = useState<DSAProblemTask[]>(STRIVER_A2Z_PROBLEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [visualizerOnly, setVisualizerOnly] = useState(false);

  // Load completion statuses from localStorage
  useEffect(() => {
    try {
      const savedStatuses = localStorage.getItem('dsa_tracker_statuses');
      if (savedStatuses) {
        const parsedMap: Record<string, DSAProblemTask['status']> = JSON.parse(savedStatuses);
        setProblems((prev) =>
          prev.map((item) =>
            parsedMap[item.id] ? { ...item, status: parsedMap[item.id] } : item
          )
        );
      }
    } catch (e) {
      console.error('Failed to load tracker statuses', e);
    }
  }, []);

  const handleToggleStatus = (id: string) => {
    setProblems((prev) => {
      const nextProblems = prev.map((item) => {
        if (item.id === id) {
          const nextStatusMap: Record<DSAProblemTask['status'], DSAProblemTask['status']> = {
            Todo: 'In Progress',
            'In Progress': 'Completed',
            Completed: 'Todo',
            'Ready for Visualizer': 'Completed',
          };
          return { ...item, status: nextStatusMap[item.status] };
        }
        return item;
      });

      // Save to localStorage
      try {
        const statusMap = nextProblems.reduce((acc, curr) => {
          acc[curr.id] = curr.status;
          return acc;
        }, {} as Record<string, string>);
        localStorage.setItem('dsa_tracker_statuses', JSON.stringify(statusMap));
      } catch (e) {
        console.error('Failed to save status', e);
      }

      return nextProblems;
    });
  };

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leetcodeNum.toString().includes(searchQuery) ||
      p.corePattern.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesVisualizerOnly = !visualizerOnly || p.hasVisualizer;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus && matchesVisualizerOnly;
  });

  // Calculate statistics
  const totalProblems = problems.length;
  const completedCount = problems.filter((p) => p.status === 'Completed').length;
  const inProgressCount = problems.filter((p) => p.status === 'In Progress').length;
  const visualizerCount = problems.filter((p) => p.hasVisualizer).length;
  const progressPercent = Math.round((completedCount / totalProblems) * 100);

  const topicsList = ['All', 'Arrays', 'Binary Search', 'Linked List', 'Stacks & Queues', 'Trees', 'Graphs', 'DP', 'Trie & Heaps'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <main className="min-h-screen bg-[#05070e] text-slate-100 p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* 1. Header Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Striver A2Z DSA Task Tracker & Visualizer Hub
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Reference Architecture
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Master LeetCode Problem Matrix • Interactive 2D Visualizer Engines • Progress Tracking
            </p>
          </div>
        </div>

        <Link
          href="/postorder-3d"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 hover:scale-105 transition-all"
        >
          <Rocket className="w-4 h-4 text-slate-950" />
          <span>Launch Tree Studio (LC 145)</span>
        </Link>
      </header>

      {/* 2. Top Stats Overview Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overall Progress</span>
            <BarChart2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{progressPercent}%</span>
            <span className="text-xs font-mono text-slate-400">
              {completedCount} / {totalProblems} Solved
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Visualizer Status */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Live Visualizers</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-purple-300">{visualizerCount} Ready</span>
            <span className="text-xs font-mono text-slate-400">2D Shiki Engines</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Interactive Tree & System Design Studios
          </p>
        </div>

        {/* Active In-Progress */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>In Progress</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-300">{inProgressCount} Tasks</span>
            <span className="text-xs font-mono text-slate-400">Active Work</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            LeetCode practice & visual dry runs
          </p>
        </div>

        {/* Blueprint Link */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950/40 p-4 rounded-2xl border border-sky-500/30 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-sky-400">
            <span>Master Blueprint</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">STRIVER_A2Z_BLUEPRINT.md</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              8 Reusable Visualizer Archetypes documented in repo
            </p>
          </div>
          <span className="text-[10px] text-sky-300 font-mono">Reference Spec Active</span>
        </div>
      </section>

      {/* 3. Search & Filter Bar */}
      <section className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search LeetCode #, problem name, or pattern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Topic Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-transparent text-sky-300 font-bold focus:outline-none cursor-pointer"
            >
              {topicsList.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-slate-200">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-transparent text-purple-300 font-bold focus:outline-none cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Visualizer Only Checkbox */}
          <button
            onClick={() => setVisualizerOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              visualizerOnly
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visualizer Ready ({visualizerCount})</span>
          </button>
        </div>
      </section>

      {/* 4. Task Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map((p) => {
          const difficultyColors = {
            Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          };

          const statusColors = {
            Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            'Ready for Visualizer': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
            Todo: 'bg-slate-800/60 text-slate-400 border-slate-700',
          };

          return (
            <div
              key={p.id}
              className={`bg-slate-900/50 p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                p.hasVisualizer ? 'border-sky-500/40 shadow-lg shadow-sky-500/5' : 'border-slate-800'
              }`}
            >
              {/* Card Header: LC # & Difficulty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono font-bold text-sky-400 border border-slate-700">
                    {p.leetcodeNum > 0 ? `LC ${p.leetcodeNum}` : 'SYS'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                      difficultyColors[p.difficulty]
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </div>

                {/* Interactive Status Button */}
                <button
                  onClick={() => handleToggleStatus(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1 transition-all ${
                    statusColors[p.status]
                  }`}
                >
                  {p.status === 'Completed' ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{p.status}</span>
                </button>
              </div>

              {/* Title & Pattern */}
              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <span className="text-sky-400 font-semibold">Pattern:</span> {p.corePattern}
                </p>
              </div>

              {/* Visualizer Archetype Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  Archetype: {p.visualizerArchetype}
                </span>

                {p.hasVisualizer && p.visualizerUrl ? (
                  <Link
                    href={p.visualizerUrl}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500 hover:text-slate-950 font-bold transition-all"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </Link>
                ) : (
                  <span className="text-slate-600 italic">Spec Ready</span>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
