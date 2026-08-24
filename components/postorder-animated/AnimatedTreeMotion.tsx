'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { GitBranch, Check } from 'lucide-react';

interface AnimatedTreeMotionProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

export function AnimatedTreeMotion({ root, currentStep }: AnimatedTreeMotionProps) {
  const { nodes, links } = useMemo(() => {
    const nList: TreeNode[] = [];
    const lList: { from: TreeNode; to: TreeNode; type: 'left' | 'right'; pathD: string }[] = [];

    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      nList.push(node);

      if (node.left) {
        const startX = node.x;
        const startY = node.y + 22;
        const endX = node.left.x;
        const endY = node.left.y - 22;
        const midY = (startY + endY) / 2;
        const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        lList.push({ from: node, to: node.left, type: 'left', pathD });
        traverse(node.left);
      }

      if (node.right) {
        const startX = node.x;
        const startY = node.y + 22;
        const endX = node.right.x;
        const endY = node.right.y - 22;
        const midY = (startY + endY) / 2;
        const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        lList.push({ from: node, to: node.right, type: 'right', pathD });
        traverse(node.right);
      }
    };

    traverse(root);
    return { nodes: nList, links: lList };
  }, [root]);

  return (
    <div className="w-full h-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              Binary Tree Topology
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Parent-child graph with active node execution states
            </p>
          </div>
        </div>

        {/* Natural Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" /> Unvisited
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-400 inline-block" /> &apos;expand&apos;
          </span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-purple-400 inline-block" /> &apos;visit&apos;
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400 inline-block" /> Visited
          </span>
        </div>
      </div>

      {/* SVG Canvas with Animated Nodes & Path Droplets */}
      <div className="relative w-full h-[320px]">
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* 1. Branch Curves with Flowing Photons */}
          {links.map((link, idx) => {
            const isTargetActive = link.to.id === currentStep.activeNodeId;
            const isTargetVisited = currentStep.visitedNodeIds.includes(link.to.id);
            const strokeColor = isTargetActive ? '#38bdf8' : isTargetVisited ? '#10b981' : '#334155';

            return (
              <g key={idx}>
                {/* Background Conduit */}
                <path
                  d={link.pathD}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Animated Line */}
                <path
                  d={link.pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isTargetActive ? '3.5' : '2'}
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />

                {/* Flowing Droplet on Active Scheduling */}
                {isTargetActive && (
                  <circle r="4.5" fill="#38bdf8">
                    <animateMotion
                      path={link.pathD}
                      dur="1.2s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                )}

                {/* Branch Name Label Pill Badge (Clear Offset + Dark Solid Backdrop) */}
                <g
                  transform={`translate(${
                    link.type === 'left'
                      ? link.from.x * 0.4 + link.to.x * 0.6 - 22
                      : link.from.x * 0.4 + link.to.x * 0.6 + 22
                  }, ${link.from.y * 0.4 + link.to.y * 0.6})`}
                >
                  <rect
                    x="-18"
                    y="-8"
                    width="36"
                    height="16"
                    rx="4"
                    fill="#0b0f19"
                    stroke={isTargetActive ? '#0284c7' : '#1e293b'}
                    strokeWidth="1.2"
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    fill={isTargetActive ? '#38bdf8' : '#94a3b8'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    .{link.type}
                  </text>
                </g>
              </g>
            );
          })}

          {/* 2. Tactile Tree Nodes */}
          {nodes.map((node) => {
            const isVisited = currentStep.visitedNodeIds.includes(node.id);
            const isActive = currentStep.activeNodeId === node.id;
            const stackPhase = currentStep.inStackMap[node.id];

            let strokeColor = '#334155';
            let fillColor = '#0f172a';
            let textColor = '#f1f5f9';

            if (isVisited) {
              strokeColor = '#10b981';
              fillColor = '#064e3b';
              textColor = '#a7f3d0';
            } else if (isActive) {
              strokeColor = '#38bdf8';
              fillColor = '#0369a1';
              textColor = '#ffffff';
            } else if (stackPhase === 'visit') {
              strokeColor = '#a855f7';
              fillColor = '#3b0764';
              textColor = '#f3e8ff';
            } else if (stackPhase === 'expand') {
              strokeColor = '#f59e0b';
              fillColor = '#451a03';
              textColor = '#fef3c7';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="transition-all duration-300"
              >
                {/* Active Focus Ping */}
                {isActive && (
                  <circle
                    r="28"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="21"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 3.5 : 2}
                  filter="url(#soft-glow)"
                  className="transition-all duration-300"
                />

                {/* Inner Bevel Ring */}
                <circle
                  r="17"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.8"
                  opacity="0.4"
                />

                {/* Center Value */}
                <text
                  textAnchor="middle"
                  dy="5.5"
                  fill={textColor}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>

                {/* Visited Checkmark */}
                {isVisited && (
                  <g transform="translate(13, -15)">
                    <circle r="7" fill="#10b981" />
                    <text textAnchor="middle" dy="3.5" fill="#022c22" fontSize="9.5" fontWeight="bold">
                      ✓
                    </text>
                  </g>
                )}

                {/* Phase Tag Below Node */}
                {stackPhase && !isVisited && (
                  <g transform="translate(0, 31)">
                    <rect
                      x="-25"
                      y="-8"
                      width="50"
                      height="16"
                      rx="8"
                      fill={stackPhase === 'visit' ? '#4c1d95' : '#78350f'}
                      stroke={stackPhase === 'visit' ? '#a855f7' : '#f59e0b'}
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill={stackPhase === 'visit' ? '#f3e8ff' : '#fef3c7'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {stackPhase}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
