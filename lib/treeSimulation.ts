import { TreeNode, TraversalFrame, TreeStepState, TreePreset } from '@/types/treeTraversal';

export const TREE_PRESETS: TreePreset[] = [
  {
    id: 'standard-6-node',
    name: 'Standard Binary Tree (6 Nodes)',
    description: 'A 3-level tree showing full left/right expansion and leaf visits.',
    root: {
      id: 'node-1',
      val: 1,
      x: 300,
      y: 60,
      left: {
        id: 'node-2',
        val: 2,
        x: 160,
        y: 150,
        left: {
          id: 'node-4',
          val: 4,
          x: 90,
          y: 250,
          left: null,
          right: null,
        },
        right: {
          id: 'node-5',
          val: 5,
          x: 230,
          y: 250,
          left: null,
          right: null,
        },
      },
      right: {
        id: 'node-3',
        val: 3,
        x: 440,
        y: 150,
        left: {
          id: 'node-6',
          val: 6,
          x: 370,
          y: 250,
          left: null,
          right: null,
        },
        right: null,
      },
    },
  },
  {
    id: 'simple-3-node',
    name: 'Simple 3-Node Tree',
    description: 'Minimal tree: Root (1), Left (2), Right (3).',
    root: {
      id: 'node-1',
      val: 1,
      x: 300,
      y: 80,
      left: {
        id: 'node-2',
        val: 2,
        x: 180,
        y: 220,
        left: null,
        right: null,
      },
      right: {
        id: 'node-3',
        val: 3,
        x: 420,
        y: 220,
        left: null,
        right: null,
      },
    },
  },
  {
    id: 'skewed-tree',
    name: 'Asymmetric Tree',
    description: 'Root with deep left branch and right leaf.',
    root: {
      id: 'node-10',
      val: 10,
      x: 300,
      y: 60,
      left: {
        id: 'node-20',
        val: 20,
        x: 180,
        y: 150,
        left: {
          id: 'node-30',
          val: 30,
          x: 100,
          y: 250,
          left: null,
          right: null,
        },
        right: null,
      },
      right: {
        id: 'node-40',
        val: 40,
        x: 420,
        y: 150,
        left: null,
        right: null,
      },
    },
  },
];

export function generatePostorderSteps(root: TreeNode | null): TreeStepState[] {
  const steps: TreeStepState[] = [];

  if (root === null) {
    steps.push({
      stepNumber: 1,
      activeLine: 2,
      poppedFrame: null,
      stackSnapshot: [],
      resultSnapshot: [],
      actionType: 'complete',
      actionTitle: 'Tree is Empty',
      hinglishNarration: 'Root null hai, isliye turant empty array [] return ho gaya.',
      whyRule: 'Base case condition check.',
      activeNodeId: null,
      visitedNodeIds: [],
      inStackMap: {},
    });
    return steps;
  }

  const result: number[] = [];
  const stack: TraversalFrame[] = [{ node: root, phase: 'expand' }];
  const visitedNodeIds: string[] = [];

  const getInStackMap = (stk: TraversalFrame[]): Record<string, 'expand' | 'visit'> => {
    const map: Record<string, 'expand' | 'visit'> = {};
    for (const f of stk) {
      map[f.node.id] = f.phase;
    }
    return map;
  };

  // Step 1: Initial push
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 6,
    poppedFrame: null,
    stackSnapshot: JSON.parse(JSON.stringify(stack)),
    resultSnapshot: [...result],
    actionType: 'init',
    actionTitle: 'Initialize Stack with Root (expand)',
    hinglishNarration: `Traversal start hua! Root node (${root.val}) ko phase: 'expand' ke sath stack mein push kiya gaya.`,
    whyRule: 'Root se traversal start hota hai. Pehle root ke children ko explore karna hai.',
    activeNodeId: root.id,
    visitedNodeIds: [...visitedNodeIds],
    inStackMap: getInStackMap(stack),
  });

  while (stack.length > 0) {
    const frame = stack.pop()!;
    const current = frame.node;

    // Step: Pop frame
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 9,
      poppedFrame: frame,
      stackSnapshot: JSON.parse(JSON.stringify(stack)),
      resultSnapshot: [...result],
      actionType: 'pop',
      actionTitle: `Pop Top Frame: Node ${current.val} [${frame.phase}]`,
      hinglishNarration: `Stack ke top se frame pop hua: Node ${current.val} with phase '${frame.phase}'.`,
      whyRule: 'Stack LIFO hai — jo element sabse top par hoga woh pehle execute hoga.',
      activeNodeId: current.id,
      visitedNodeIds: [...visitedNodeIds],
      inStackMap: getInStackMap(stack),
    });

    if (frame.phase === 'visit') {
      result.push(current.val);
      visitedNodeIds.push(current.id);

      // Step: Visit node & push to result
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 14,
        poppedFrame: frame,
        stackSnapshot: JSON.parse(JSON.stringify(stack)),
        resultSnapshot: [...result],
        actionType: 'visit',
        actionTitle: `✅ Visit Node ${current.val} -> Add to Result Array`,
        hinglishNarration: `Node ${current.val} ka phase 'visit' tha! Iska matlab iske left aur right children pehle hi process ho chuke hain. Ab iski value result array me append ho gayi: [${result.join(', ')}].`,
        whyRule: 'Postorder rule: Children ke baad hi Parent node ko visit (consume) kiya jata hai.',
        activeNodeId: current.id,
        visitedNodeIds: [...visitedNodeIds],
        inStackMap: getInStackMap(stack),
      });
      continue;
    }

    // Scheduling: phase === 'expand'
    // 1. Push Root Visit Marker
    stack.push({ node: current, phase: 'visit' });
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 23,
      poppedFrame: null,
      stackSnapshot: JSON.parse(JSON.stringify(stack)),
      resultSnapshot: [...result],
      actionType: 'push_visit',
      actionTitle: `Push Visit Marker for Node ${current.val}`,
      hinglishNarration: `Node ${current.val} ko wapas stack mein push kiya gaya with phase: 'visit'. Yeh marker children ke neeche rahega taaki children ke baad process ho.`,
      whyRule: 'Root visit sabse LAST me chahiye, isliye iska marker sabse PEHLE push karte hain (LIFO property).',
      activeNodeId: current.id,
      visitedNodeIds: [...visitedNodeIds],
      inStackMap: getInStackMap(stack),
    });

    // 2. Push Right Child (if exists)
    if (current.right !== null) {
      stack.push({ node: current.right, phase: 'expand' });
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 27,
        poppedFrame: null,
        stackSnapshot: JSON.parse(JSON.stringify(stack)),
        resultSnapshot: [...result],
        actionType: 'push_right',
        actionTitle: `Push Right Child: Node ${current.right.val} (expand)`,
        hinglishNarration: `Right child (${current.right.val}) ko stack me push kiya. Yeh Left child ke neeche rahega.`,
        whyRule: 'Right child ko Left child ke BAAD execute karna hai, isliye Right ko Left se PEHLE push karte hain.',
        activeNodeId: current.right.id,
        visitedNodeIds: [...visitedNodeIds],
        inStackMap: getInStackMap(stack),
      });
    }

    // 3. Push Left Child (if exists)
    if (current.left !== null) {
      stack.push({ node: current.left, phase: 'expand' });
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 33,
        poppedFrame: null,
        stackSnapshot: JSON.parse(JSON.stringify(stack)),
        resultSnapshot: [...result],
        actionType: 'push_left',
        actionTitle: `Push Left Child: Node ${current.left.val} (expand)`,
        hinglishNarration: `Left child (${current.left.val}) ko stack me last push kiya, jisse yeh Stack ke bilkul TOP par aa gaya!`,
        whyRule: 'Left subtree ko sabse PEHLE execute karna hai, isliye isko last push karte hain taaki agle loop me pehle pop ho.',
        activeNodeId: current.left.id,
        visitedNodeIds: [...visitedNodeIds],
        inStackMap: getInStackMap(stack),
      });
    }
  }

  // Final step: Complete
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 38,
    poppedFrame: null,
    stackSnapshot: [],
    resultSnapshot: [...result],
    actionType: 'complete',
    actionTitle: '🎉 Postorder Traversal Complete!',
    hinglishNarration: `Stack empty ho gaya! Final postorder traversal result: [${result.join(', ')}].`,
    whyRule: 'Saare nodes Left -> Right -> Root order me successfully process ho gaye.',
    activeNodeId: null,
    visitedNodeIds: [...visitedNodeIds],
    inStackMap: {},
  });

  return steps;
}
