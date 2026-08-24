'use client';

import React from 'react';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { Check, Sparkles } from 'lucide-react';

interface TreeCanvasProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

export function TreeCanvas({ root, currentStep }: TreeCanvasProps) {
  // Collect all nodes and connections from root
  const nodes: TreeNode[] = [];
  const links: { from: TreeNode; to: TreeNode; type: 'left' | 'right' }[] = [];

  const traverse = (node: TreeNode | null) => {
    if (!node) return;
    nodes.push(node);
    if (node.left) {
      links.push({ from: node, to: node.left, type: 'left' });
      traverse(node.left);
    }
    if (node.right) {
      links.push({ from: node, to: node.right, type: 'right' });
      traverse(node.right);
    }
  };

  traverse(root);

  return (
    <div className="relative w-full h-[320px] bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl p-4 flex flex-col">
      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Binary Tree Topology
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600 inline-block" /> Idle
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-400 inline-block" /> Expand
          </span>
          <span className="flex items-center gap-1 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/30 border border-purple-400 inline-block" /> Visit Marker
          </span>
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" /> Visited
          </span>
        </div>
      </div>

      {/* SVG Canvas for Tree Links and Nodes */}
      <div className="flex-1 relative w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Glow Filter */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Branch Links */}
          {links.map((link, idx) => {
            const isTargetActive = link.to.id === currentStep.activeNodeId;
            const isTargetVisited = currentStep.visitedNodeIds.includes(link.to.id);

            return (
              <g key={idx}>
                {/* Curved Connection Path */}
                <path
                  d={`M ${link.from.x} ${link.from.y + 18} C ${link.from.x} ${
                    (link.from.y + link.to.y) / 2
                  }, ${link.to.x} ${(link.from.y + link.to.y) / 2}, ${link.to.x} ${link.to.y - 18}`}
                  fill="none"
                  stroke={isTargetActive ? '#38bdf8' : isTargetVisited ? '#10b981' : '#334155'}
                  strokeWidth={isTargetActive ? 3 : 2}
                  strokeDasharray={isTargetActive ? '4 2' : undefined}
                  className="transition-all duration-300"
                />
                {/* Branch Label (L / R) */}
                <text
                  x={(link.from.x + link.to.x) / 2 + (link.type === 'left' ? -10 : 10)}
                  y={(link.from.y + link.to.y) / 2}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {link.type === 'left' ? 'L' : 'R'}
                </text>
              </g>
            );
          })}

          {/* Render Tree Nodes */}
          {nodes.map((node) => {
            const isVisited = currentStep.visitedNodeIds.includes(node.id);
            const isActive = currentStep.activeNodeId === node.id;
            const stackPhase = currentStep.inStackMap[node.id];

            let fillColor = '#0f172a';
            let strokeColor = '#334155';
            let textColor = '#cbd5e1';
            let filter: string | undefined = undefined;

            if (isVisited) {
              fillColor = '#064e3b';
              strokeColor = '#10b981';
              textColor = '#6ee7b7';
              filter = 'url(#glow-green)';
            } else if (isActive) {
              fillColor = '#0369a1';
              strokeColor = '#38bdf8';
              textColor = '#ffffff';
              filter = 'url(#glow-cyan)';
            } else if (stackPhase === 'visit') {
              fillColor = '#3b0764';
              strokeColor = '#a855f7';
              textColor = '#e9d5ff';
            } else if (stackPhase === 'expand') {
              fillColor = '#451a03';
              strokeColor = '#f59e0b';
              textColor = '#fde68a';
            }

            return (
              <g
                key={node.id}
                className="transition-all duration-300"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Active Outer Pulse Ring */}
                {isActive && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Node Circle */}
                <circle
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 3 : 2}
                  filter={filter}
                />

                {/* Node Value */}
                <text
                  textAnchor="middle"
                  dy="5"
                  fill={textColor}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>

                {/* Visited Checkmark Badge */}
                {isVisited && (
                  <g transform="translate(10, -14)">
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

                {/* Phase Pill Badge */}
                {stackPhase && !isVisited && (
                  <g transform="translate(0, 28)">
                    <rect
                      x="-22"
                      y="-7"
                      width="44"
                      height="14"
                      rx="7"
                      fill={stackPhase === 'visit' ? '#581c87' : '#78350f'}
                      stroke={stackPhase === 'visit' ? '#a855f7' : '#f59e0b'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="3"
                      fill={stackPhase === 'visit' ? '#f3e8ff' : '#fef3c7'}
                      fontSize="8"
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
