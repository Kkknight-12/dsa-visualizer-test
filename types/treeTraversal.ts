export interface TreeNode {
  val: number;
  id: string;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

export type TraversalPhase = 'expand' | 'visit';

export interface TraversalFrame {
  node: TreeNode;
  phase: TraversalPhase;
}

export interface TreeStepState {
  stepNumber: number;
  activeLine: number;
  poppedFrame: TraversalFrame | null;
  stackSnapshot: TraversalFrame[];
  resultSnapshot: number[];
  actionType: 'init' | 'pop' | 'visit' | 'push_visit' | 'push_right' | 'push_left' | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
  activeNodeId: string | null;
  visitedNodeIds: string[];
  inStackMap: Record<string, TraversalPhase>;
}

export interface TreePreset {
  id: string;
  name: string;
  description: string;
  root: TreeNode;
}
