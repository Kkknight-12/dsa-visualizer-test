'use client';

import React, { useMemo } from 'react';
import { TreeNode, TreeStepState } from '@/types/treeTraversal';
import { TreeNodeModel } from './models/TreeNodeModel';
import { BranchConduitModel } from './models/BranchConduitModel';

interface Tree3DProps {
  root: TreeNode;
  currentStep: TreeStepState;
}

interface Node3DItem {
  id: string;
  val: number;
  position: [number, number, number];
}

interface Link3DItem {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  targetId: string;
  type: 'left' | 'right';
}

export function Tree3D({ root, currentStep }: Tree3DProps) {
  // Compute balanced, hierarchical 3D tree coordinates on left side of stage
  const { nodes3D, links3D } = useMemo(() => {
    const nodes: Node3DItem[] = [];
    const links: Link3DItem[] = [];

    // Precise hierarchical level positioning
    const mapNodePos = (node: TreeNode, x: number, y: number, spread: number) => {
      const pos: [number, number, number] = [x, y, 0];
      nodes.push({ id: node.id, val: node.val, position: pos });

      if (node.left) {
        const leftX = x - spread;
        const leftY = y - 1.6;
        const leftPos: [number, number, number] = [leftX, leftY, 0];
        links.push({ fromPos: pos, toPos: leftPos, targetId: node.left.id, type: 'left' });
        mapNodePos(node.left, leftX, leftY, spread * 0.55);
      }

      if (node.right) {
        const rightX = x + spread;
        const rightY = y - 1.6;
        const rightPos: [number, number, number] = [rightX, rightY, 0];
        links.push({ fromPos: pos, toPos: rightPos, targetId: node.right.id, type: 'right' });
        mapNodePos(node.right, rightX, rightY, spread * 0.55);
      }
    };

    if (root) {
      // Root starts at x = -3.2, y = 2.4 with initial horizontal spread of 1.8
      mapNodePos(root, -3.4, 2.4, 1.8);
    }

    return { nodes3D: nodes, links3D: links };
  }, [root]);

  return (
    <group>
      {/* 1. Natural S-Curved Glowing Tree Branches */}
      {links3D.map((link, idx) => {
        const isTargetActive = link.targetId === currentStep.activeNodeId;
        const isTargetVisited = currentStep.visitedNodeIds.includes(link.targetId);

        return (
          <BranchConduitModel
            key={idx}
            fromPos={link.fromPos}
            toPos={link.toPos}
            isActive={isTargetActive}
            isVisited={isTargetVisited}
            type={link.type}
          />
        );
      })}

      {/* 2. Frosted Glass Glowing Tree Nodes */}
      {nodes3D.map((node) => {
        const isVisited = currentStep.visitedNodeIds.includes(node.id);
        const isActive = currentStep.activeNodeId === node.id;
        const stackPhase = currentStep.inStackMap[node.id];

        return (
          <TreeNodeModel
            key={node.id}
            id={node.id}
            val={node.val}
            position={node.position}
            isActive={isActive}
            isVisited={isVisited}
            stackPhase={stackPhase}
          />
        );
      })}
    </group>
  );
}
