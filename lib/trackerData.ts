export interface DSAProblemTask {
  id: string;
  leetcodeNum: number;
  title: string;
  topic: 'Arrays' | 'Binary Search' | 'Linked List' | 'Stacks & Queues' | 'Trees' | 'Graphs' | 'DP' | 'Trie & Heaps';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  corePattern: string;
  visualizerArchetype: string;
  hasVisualizer: boolean;
  visualizerUrl?: string;
  status: 'Completed' | 'In Progress' | 'Ready for Visualizer' | 'Todo';
  notes: string;
}

export const STRIVER_A2Z_PROBLEMS: DSAProblemTask[] = [
  // 1. Arrays & Two Pointers / Sliding Window
  {
    id: 'lc-75',
    leetcodeNum: 75,
    title: 'Sort Colors (0s, 1s, 2s)',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: 'Dutch National Flag (3 Pointers)',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: true,
    visualizerUrl: '/sort-colors',
    status: 'Completed',
    notes: '3 Pointers (low, mid, high) swapping elements live in 1-pass.'
  },
  {
    id: 'lc-53',
    leetcodeNum: 53,
    title: 'Maximum Subarray',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: "Kadane's Algorithm",
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: true,
    status: 'Completed',
    visualizerUrl: '/kadanes',
    notes: 'Running sum accumulator vs Max sum reset bar reusing ReorderableArrayRail.'
  },
  {
    id: 'lc-31',
    leetcodeNum: 31,
    title: 'Next Permutation',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: 'Lexicographical Swap & Reverse',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: true,
    visualizerUrl: '/next-permutation',
    status: 'Completed',
    notes: 'Find pivot, swap next greater, and reverse right suffix reusing ReorderableArrayRail.'
  },
  {
    id: 'lc-56',
    leetcodeNum: 56,
    title: 'Merge Intervals',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: 'Interval Overlap Collapse',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Sort intervals by start time and collapse overlapping ranges.'
  },
  {
    id: 'lc-15',
    leetcodeNum: 15,
    title: '3Sum',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: 'Two Pointers + Sorting',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: true,
    visualizerUrl: '/3sum',
    status: 'Completed',
    notes: 'Fixed anchor pointer i + dual scanning pointers (left, right).'
  },
  {
    id: 'lc-3',
    leetcodeNum: 3,
    title: 'Longest Substring Without Repeating',
    topic: 'Arrays',
    difficulty: 'Medium',
    corePattern: 'Variable Sliding Window',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Expand right pointer and contract left pointer using HashSet.'
  },
  {
    id: 'lc-42',
    leetcodeNum: 42,
    title: 'Trapping Rain Water',
    topic: 'Arrays',
    difficulty: 'Hard',
    corePattern: 'Two Pointers / LeftMax & RightMax Invariant',
    visualizerArchetype: 'Dual Pointer Rail',
    hasVisualizer: true,
    visualizerUrl: '/trapping-water',
    status: 'Completed',
    notes: '2D Elevation Bar chart with liquid trapped height accumulation and stable pointers.'
  },

  // 2. Binary Search
  {
    id: 'lc-33',
    leetcodeNum: 33,
    title: 'Search in Rotated Sorted Array',
    topic: 'Binary Search',
    difficulty: 'Medium',
    corePattern: 'Modified Binary Search',
    visualizerArchetype: 'Range Eliminator Slider',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Identify sorted half and eliminate unpromising range.'
  },
  {
    id: 'lc-540',
    leetcodeNum: 540,
    title: 'Single Element in Sorted Array',
    topic: 'Binary Search',
    difficulty: 'Medium',
    corePattern: 'Index Parity Halving',
    visualizerArchetype: 'Range Eliminator Slider',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Even/Odd index pair parity check to halve search space.'
  },
  {
    id: 'lc-875',
    leetcodeNum: 875,
    title: 'Koko Eating Bananas',
    topic: 'Binary Search',
    difficulty: 'Medium',
    corePattern: 'BS on Answer Space',
    visualizerArchetype: 'Range Eliminator Slider',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Search range [1, max_speed] with feasibility check bar.'
  },

  // 3. Linked List
  {
    id: 'lc-206',
    leetcodeNum: 206,
    title: 'Reverse Linked List',
    topic: 'Linked List',
    difficulty: 'Easy',
    corePattern: 'Pointer Reversal',
    visualizerArchetype: 'Pointers & Node Conduit',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Iterative pointer flips (prev, curr, next).'
  },
  {
    id: 'lc-141',
    leetcodeNum: 141,
    title: 'Linked List Cycle Detection',
    topic: 'Linked List',
    difficulty: 'Easy',
    corePattern: "Floyd's Cycle Detection",
    visualizerArchetype: 'Pointers & Node Conduit',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Slow (1 step) and Fast (2 steps) pointers race animation.'
  },
  {
    id: 'lc-146',
    leetcodeNum: 146,
    title: 'LRU Cache',
    topic: 'Linked List',
    difficulty: 'Medium',
    corePattern: 'Doubly LL + Hash Map',
    visualizerArchetype: 'Pointers & Node Conduit',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'HashMap O(1) key lookup -> Doubly LL head/tail node eviction.'
  },

  // 4. Stacks & Queues
  {
    id: 'lc-496',
    leetcodeNum: 496,
    title: 'Next Greater Element I & II',
    topic: 'Stacks & Queues',
    difficulty: 'Easy',
    corePattern: 'Monotonic Decreasing Stack',
    visualizerArchetype: 'Monotonic Stack Chamber',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Pop smaller elements from stack top until next greater is found.'
  },
  {
    id: 'lc-84',
    leetcodeNum: 84,
    title: 'Largest Rectangle in Histogram',
    topic: 'Stacks & Queues',
    difficulty: 'Hard',
    corePattern: 'Monotonic Stack',
    visualizerArchetype: 'Monotonic Stack Chamber',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Calculate left/right boundary limits using monotonic stack.'
  },
  {
    id: 'lc-239',
    leetcodeNum: 239,
    title: 'Sliding Window Maximum',
    topic: 'Stacks & Queues',
    difficulty: 'Hard',
    corePattern: 'Monotonic Deque',
    visualizerArchetype: 'Monotonic Stack Chamber',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Maintain decreasing deque of indices for max in sliding window.'
  },

  // 5. Trees & BST
  {
    id: 'lc-145',
    leetcodeNum: 145,
    title: 'Binary Tree Postorder Traversal',
    topic: 'Trees',
    difficulty: 'Easy',
    corePattern: 'Two-Phase Stack Expansion',
    visualizerArchetype: 'Tactile Tree Graph Engine',
    hasVisualizer: true,
    visualizerUrl: '/postorder-3d',
    status: 'Completed',
    notes: 'Fully interactive studio with 2D Tree, LIFO Stack, Shiki Code Runner & Multi-Layouts!'
  },
  {
    id: 'lc-102',
    leetcodeNum: 102,
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    corePattern: 'BFS Queue Traversal',
    visualizerArchetype: 'Tactile Tree Graph Engine',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Queue intake + Level-by-level highlighted wavefronts.'
  },
  {
    id: 'lc-236',
    leetcodeNum: 236,
    title: 'Lowest Common Ancestor (LCA)',
    topic: 'Trees',
    difficulty: 'Medium',
    corePattern: 'Tree Recursion Path',
    visualizerArchetype: 'Tactile Tree Graph Engine',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Dual target search paths merging at LCA node.'
  },
  {
    id: 'lc-98',
    leetcodeNum: 98,
    title: 'Validate Binary Search Tree',
    topic: 'Trees',
    difficulty: 'Medium',
    corePattern: 'Min/Max Range Propagation',
    visualizerArchetype: 'Tactile Tree Graph Engine',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Propagate (min, max) bounds to left and right children.'
  },

  // 6. Graphs
  {
    id: 'lc-200',
    leetcodeNum: 200,
    title: 'Number of Islands',
    topic: 'Graphs',
    difficulty: 'Medium',
    corePattern: 'Grid BFS/DFS Flood Fill',
    visualizerArchetype: 'Graph Network Mesh',
    hasVisualizer: false,
    status: 'Todo',
    notes: '2D Land vs Water Grid with flood fill wavefront animation.'
  },
  {
    id: 'lc-207',
    leetcodeNum: 207,
    title: 'Course Schedule (Topological Sort)',
    topic: 'Graphs',
    difficulty: 'Medium',
    corePattern: "Kahn's Algorithm (BFS Indegree)",
    visualizerArchetype: 'Graph Network Mesh',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Directed dependency graph + Indegree array & Queue.'
  },
  {
    id: 'lc-743',
    leetcodeNum: 743,
    title: 'Network Delay Time (Dijkstra)',
    topic: 'Graphs',
    difficulty: 'Medium',
    corePattern: "Dijkstra's Shortest Path",
    visualizerArchetype: 'Graph Network Mesh',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Priority Queue + Min-Distance array + Edge relaxation waves.'
  },
  {
    id: 'lc-684',
    leetcodeNum: 684,
    title: 'Redundant Connection (DSU)',
    topic: 'Graphs',
    difficulty: 'Medium',
    corePattern: 'Disjoint Set Union (Union-Find)',
    visualizerArchetype: 'Graph Network Mesh',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Parent array + Rank array + Cycle detection link.'
  },

  // 7. Dynamic Programming
  {
    id: 'lc-70',
    leetcodeNum: 70,
    title: 'Climbing Stairs',
    topic: 'DP',
    difficulty: 'Easy',
    corePattern: '1D DP State Transition',
    visualizerArchetype: 'Grid DP Matrix Explorer',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Array cell filling with dp[i-1] + dp[i-2] dependency arrows.'
  },
  {
    id: 'lc-62',
    leetcodeNum: 62,
    title: 'Unique Paths',
    topic: 'DP',
    difficulty: 'Medium',
    corePattern: '2D Grid DP',
    visualizerArchetype: 'Grid DP Matrix Explorer',
    hasVisualizer: false,
    status: 'Todo',
    notes: '2D Grid cell filling from top and left neighbors.'
  },
  {
    id: 'lc-416',
    leetcodeNum: 416,
    title: 'Partition Equal Subset Sum',
    topic: 'DP',
    difficulty: 'Medium',
    corePattern: '0/1 Knapsack DP',
    visualizerArchetype: 'Grid DP Matrix Explorer',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Item x Target Sum DP Matrix filling.'
  },
  {
    id: 'lc-1143',
    leetcodeNum: 1143,
    title: 'Longest Common Subsequence (LCS)',
    topic: 'DP',
    difficulty: 'Medium',
    corePattern: '2D String Match DP',
    visualizerArchetype: 'Grid DP Matrix Explorer',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Match (diagonal+1) vs Mismatch (max top/left).'
  },

  // 8. Trie & Heaps
  {
    id: 'lc-208',
    leetcodeNum: 208,
    title: 'Implement Trie (Prefix Tree)',
    topic: 'Trie & Heaps',
    difficulty: 'Medium',
    corePattern: 'N-Ary Character Tree',
    visualizerArchetype: 'Character Trie & Dual Heap Canvas',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Character node insertion & isEnd word termination highlights.'
  },
  {
    id: 'lc-215',
    leetcodeNum: 215,
    title: 'Kth Largest Element in an Array',
    topic: 'Trie & Heaps',
    difficulty: 'Medium',
    corePattern: 'Min-Heap / Max-Heap',
    visualizerArchetype: 'Character Trie & Dual Heap Canvas',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'Binary Heap Tree <-> Array Index mapping + Percolate Up/Down.'
  },
  {
    id: 'sys-ch',
    leetcodeNum: 0,
    title: 'Consistent Hashing (System Design)',
    topic: 'Graphs',
    difficulty: 'Hard',
    corePattern: 'Virtual Nodes & Hash Ring',
    visualizerArchetype: 'System Architecture Engine',
    hasVisualizer: false,
    status: 'Todo',
    notes: 'System Design Hash Ring module.'
  }
];
