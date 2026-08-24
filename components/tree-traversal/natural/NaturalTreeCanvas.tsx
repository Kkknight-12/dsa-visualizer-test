'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { Check, Sparkles } from 'lucide-react';

interface NaturalTreeCanvasProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

export function NaturalTreeCanvas({ root, currentStep }: NaturalTreeCanvasProps) {
  // Collect all nodes and connections
  const { nodes, links } = useMemo(() => {
    const nList: TreeNode[] = [];
    const lList: { from: TreeNode; to: TreeNode; type: 'left' | 'right'; pathD: string }[] = [];

    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      nList.push(node);

      if (node.left) {
        // Natural smooth S-Curve from bottom of parent to top of child
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
    <div className="relative w-full h-[360px] bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl p-5 flex flex-col justify-between">
      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Binary Tree Flow
          </span>
        </div>

        {/* Clean Natural Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" /> Idle
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-400 inline-block" /> Expand
          </span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/20 border border-purple-400 inline-block" /> Visit Marker
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" /> Visited
          </span>
        </div>
      </div>

      {/* SVG Canvas for Tree Topology & Fluid Particles */}
      <div className="relative flex-1 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Soft Natural Drop Shadows */}
            <filter id="soft-node-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
            </filter>
            <filter id="active-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Linear Gradients */}
            <linearGradient id="branch-gradient-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="branch-gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* 1. Branch Curves */}
          {links.map((link, idx) => {
            const isTargetActive = link.to.id === currentStep.activeNodeId;
            const isTargetVisited = currentStep.visitedNodeIds.includes(link.to.id);

            return (
              <g key={idx}>
                {/* Background Shadow Conduit */}
                <path
                  d={link.pathD}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Main Branch Line */}
                <path
                  d={link.pathD}
                  fill="none"
                  stroke={isTargetActive ? '#38bdf8' : isTargetVisited ? '#10b981' : '#334155'}
                  strokeWidth={isTargetActive ? '3' : '2'}
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />

                {/* Fluid Flowing Droplet on Active Scheduling */}
                {isTargetActive && (
                  <circle r="4" fill="#38bdf8" filter="url(#active-soft-glow)">
                    <animateMotion
                      path={link.pathD}
                      dur="1.2s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                )}

                {/* Subtle L / R Branch Indicator */}
                <text
                  x={(link.from.x + link.to.x) / 2 + (link.type === 'left' ? -12 : 12)}
                  y={(link.from.y + link.to.y) / 2}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dy="3"
                >
                  {link.type === 'left' ? 'L' : 'R'}
                </text>
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
            let textColor = '#e2e8f0';
            let shadowFilter = 'url(#soft-node-shadow)';

            if (isVisited) {
              strokeColor = '#10b981';
              fillColor = '#064e3b';
              textColor = '#6ee7b7';
            } else if (isActive) {
              strokeColor = '#38bdf8';
              fillColor = '#0369a1';
              textColor = '#ffffff';
              shadowFilter = 'url(#active-soft-glow)';
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
                {/* Active Outer Soft Pulse */}
                {isActive && (
                  <circle
                    r="26"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="20"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? '3' : '2'}
                  filter={shadowFilter}
                  className="transition-all duration-300"
                />

                {/* Inner Bevel Ring for Depth */}
                <circle
                  r="17"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.8"
                  opacity="0.4"
                />

                {/* Centered Node Value */}
                <text
                  textAnchor="middle"
                  dy="5"
                  fill={textColor}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>

                {/* Visited Checkmark Badge */}
                {isVisited && (
                  <g transform="translate(12, -14)">
                    <circle r="7" fill="#10b981" />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill="#022c22"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                )}

                {/* Natural Phase Badge Below Node */}
                {stackPhase && !isVisited && (
                  <g transform="translate(0, 30)">
                    <rect
                      x="-24"
                      y="-7"
                      width="48"
                      height="15"
                      rx="7.5"
                      fill={stackPhase === 'visit' ? '#4c1d95' : '#78350f'}
                      stroke={stackPhase === 'visit' ? '#a855f7' : '#f59e0b'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill={stackPhase === 'visit' ? '#f3e8ff' : '#fef3c7'}
                      fontSize="8.5"
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
