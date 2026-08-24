'use client';

import React, { useMemo } from 'react';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { GitBranch, Check } from 'lucide-react';

interface RealisticTreeDiagramProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

export function RealisticTreeDiagram({ root, currentStep }: RealisticTreeDiagramProps) {
  const { nodes, links } = useMemo(() => {
    const nList: TreeNode[] = [];
    const lList: { from: TreeNode; to: TreeNode; type: 'left' | 'right'; pathD: string }[] = [];

    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      nList.push(node);

      if (node.left) {
        const startX = node.x;
        const startY = node.y + 20;
        const endX = node.left.x;
        const endY = node.left.y - 20;
        const midY = (startY + endY) / 2;
        const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        lList.push({ from: node, to: node.left, type: 'left', pathD });
        traverse(node.left);
      }

      if (node.right) {
        const startX = node.x;
        const startY = node.y + 20;
        const endX = node.right.x;
        const endY = node.right.y - 20;
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
    <div className="w-full bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Binary Tree (In-Memory Reference Graph)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" /> Unvisited
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500 inline-block" /> In Stack (expand)
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/20 border border-purple-500 inline-block" /> Marker (visit)
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" /> Visited
          </span>
        </div>
      </div>

      {/* Natural Tree SVG Canvas */}
      <div className="relative w-full h-[280px]">
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Arrow Marker */}
            <marker id="branch-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          {/* 1. Branch Curves */}
          {links.map((link, idx) => {
            const isTargetActive = link.to.id === currentStep.activeNodeId;
            const isTargetVisited = currentStep.visitedNodeIds.includes(link.to.id);
            const strokeColor = isTargetActive ? '#38bdf8' : isTargetVisited ? '#10b981' : '#475569';

            return (
              <g key={idx}>
                {/* Branch Path */}
                <path
                  d={link.pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isTargetActive ? 2.5 : 1.8}
                  strokeDasharray={isTargetActive ? '4 2' : undefined}
                />
                {/* L / R Label */}
                <text
                  x={(link.from.x + link.to.x) / 2 + (link.type === 'left' ? -12 : 12)}
                  y={(link.from.y + link.to.y) / 2}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dy="3"
                >
                  .{link.type}
                </text>
              </g>
            );
          })}

          {/* 2. Realistic Tree Nodes */}
          {nodes.map((node) => {
            const isVisited = currentStep.visitedNodeIds.includes(node.id);
            const isActive = currentStep.activeNodeId === node.id;
            const stackPhase = currentStep.inStackMap[node.id];

            let strokeColor = '#475569';
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
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* Active Focus Ring */}
                {isActive && (
                  <circle
                    r="25"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="19"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 3 : 2}
                />

                {/* Center Node Value */}
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

                {/* Visited Checkmark */}
                {isVisited && (
                  <g transform="translate(12, -14)">
                    <circle r="6.5" fill="#10b981" />
                    <text textAnchor="middle" dy="3.5" fill="#022c22" fontSize="9" fontWeight="bold">
                      ✓
                    </text>
                  </g>
                )}

                {/* State Tag Below Node */}
                {stackPhase && !isVisited && (
                  <g transform="translate(0, 29)">
                    <rect
                      x="-24"
                      y="-7"
                      width="48"
                      height="14"
                      rx="4"
                      fill={stackPhase === 'visit' ? '#4c1d95' : '#78350f'}
                      stroke={stackPhase === 'visit' ? '#a855f7' : '#f59e0b'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="3.5"
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
