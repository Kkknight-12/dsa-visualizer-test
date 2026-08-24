# Striver A2Z DSA Sheet — Master LeetCode Visualizer Blueprint 🚀

This document outlines the master list of essential LeetCode problems from **Striver's A2Z DSA Sheet** along with the specialized **Visualizer Archetype** required for each topic. This serves as the reference architecture for building interactive visualizers in this repository.

---

## 📌 Master Topic & Problem Matrix

### 1. Arrays & Two Pointers / Sliding Window
* **Visualizer Archetype**: `Dual Pointer Rail` & `Dynamic Window Highlight`
* **Key Components**: Array bar/cell track, moving `left`/`right` pointers with color highlights, window sum/condition tracker.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 1 | LC 75 | Sort Colors | Dutch National Flag (3-Pointers) | 3 Pointers (`low`, `mid`, `high`) swapping elements live |
| 2 | LC 53 | Maximum Subarray | Kadane's Algorithm | Running sum accumulator vs Max sum reset bar |
| 3 | LC 31 | Next Permutation | Lexicographical Swap | Pivot finding & suffix reversal animation |
| 4 | LC 56 | Merge Intervals | Interval Overlap | Horizontal line/range bar collapse & merge animation |
| 5 | LC 15 | 3Sum | Two Pointers + Sorting | Fixed anchor pointer + dual scanning pointers |
| 6 | LC 3 | Longest Substring Without Repeating | Variable Sliding Window | Expanding & shrinking window highlight with Hash Set state |
| 7 | LC 42 | Trapping Rain Water | Two Pointers / Pre-calculation | 2D Bar chart with liquid filling animation |

---

### 2. Binary Search
* **Visualizer Archetype**: `Range Eliminator Slider`
* **Key Components**: Sorted array bar, `low`, `mid`, `high` marker highlights, grayed-out eliminated search space.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 8 | LC 33 | Search in Rotated Sorted Array | Modified Binary Search | Pivot point detection & active half decision |
| 9 | LC 540 | Single Element in Sorted Array | Index Parity BS | Even/Odd index check & halving animation |
| 10 | LC 875 | Koko Eating Bananas | BS on Answer Space | Range `[1, max]` search with feasibility check bar |
| 11 | LC 1011 | Capacity To Ship Packages Within D Days | BS on Answer Space | Capacity slider with day-chunk grouping animation |

---

### 3. Linked List
* **Visualizer Archetype**: `Pointers & Node Conduit`
* **Key Components**: Linked nodes with directional arrows, dynamic pointer re-linking (`next` pointers fading & re-drawing).

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 12 | LC 206 | Reverse Linked List | Pointer Reversal | `prev`, `curr`, `next` pointers + Arrow direction flips |
| 13 | LC 141 / 142 | Linked List Cycle I & II | Slow & Fast Pointers (Floyd's) | Circular LL with tortoise/hare race animation |
| 14 | LC 21 | Merge Two Sorted Lists | Two-Pointer Interleaving | Dual LL stream merging into a single sorted list |
| 15 | LC 146 | LRU Cache | Doubly LL + Hash Map | HashMap key lookup -> Doubly LL head/tail movement |

---

### 4. Stacks & Queues
* **Visualizer Archetype**: `Monotonic Stack Chamber` & `LIFO/FIFO Work Queue`
* **Key Components**: Vertical stack container, pop/push frame animations, element comparison & popping sequence.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 16 | LC 496 / 503 | Next Greater Element I & II | Monotonic Decreasing Stack | Pop smaller elements until greater element found |
| 17 | LC 84 | Largest Rectangle in Histogram | Monotonic Stack | Histogram bars with expanding rectangle area overlays |
| 18 | LC 239 | Sliding Window Maximum | Monotonic Deque | Window sliding over array + Deque front/back operations |
| 19 | LC 155 | Min Stack | Auxiliary Stack | Main Stack side-by-side with Min-Tracker Stack |

---

### 5. Binary Trees & BST
* **Visualizer Archetype**: `Tactile Tree Graph & Traversal Engine` *(Completed in this Repo!)*
* **Key Components**: SVG Tree Topology, Active state nodes (unvisited, expand, visit, visited), LIFO stack/queue.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 20 | LC 145 | Binary Tree Postorder Traversal | Two-Phase Stack Expansion | **Completed** (Tree + Stack + Shiki Code Runner) |
| 21 | LC 102 | Binary Tree Level Order Traversal | BFS Queue Traversal | Queue intake + Level-by-level highlighted tree waves |
| 22 | LC 543 | Diameter of Binary Tree | Postorder Height Calculation | Subtree height calculation propagating up from leaves |
| 23 | LC 236 | Lowest Common Ancestor (LCA) | Tree Recursion Path | Dual target path highlight merging at LCA node |
| 24 | LC 98 | Validate Binary Search Tree | Min/Max Range Propagation | Node bounds `(min, max)` floating tooltip validation |
| 25 | LC 450 | Delete Node in a BST | BST Struct Mutator | Replacement by Inorder Successor node animation |

---

### 6. Graphs
* **Visualizer Archetype**: `Graph Network Mesh & Wavefront Expansion`
* **Key Components**: Node-edge network, distance table, queue/stack/priority queue, visited state coloring.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 26 | LC 200 | Number of Islands | Grid BFS/DFS | Water vs Land grid with Flood Fill color waves |
| 27 | LC 207 / 210 | Course Schedule I & II | Topological Sort (Kahn's) | Directed Dependency Graph + Indegree array & Queue |
| 28 | LC 743 | Network Delay Time / Shortest Path | Dijkstra's Algorithm | Priority Queue + Min-Distance Array + Relaxing Edges |
| 29 | LC 1584 | Min Cost to Connect All Points | Prim's / Kruskal's MST | Edge weight sorting + Union-Find component merging |
| 30 | LC 684 | Redundant Connection | Disjoint Set Union (DSU) | Parent array + Rank array + Cycle detection link |

---

### 7. Dynamic Programming (DP)
* **Visualizer Archetype**: `Grid DP Matrix & Decision Tree Explorer`
* **Key Components**: 1D/2D State table, active cell computation dependencies (arrows from previous state cells), memoization array.

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 31 | LC 70 / 198 | Climbing Stairs / House Robber | 1D DP State | Array cell filling with `dp[i-1] + dp[i-2]` arrows |
| 32 | LC 62 / 64 | Unique Paths / Min Path Sum | 2D Grid DP | 2D Grid cell filling from `top` & `left` cells |
| 33 | LC 416 | Partition Equal Subset Sum | 0/1 Knapsack DP | Row (items) x Col (target sum) DP matrix filling |
| 34 | LC 1143 | Longest Common Subsequence (LCS) | 2D String Match DP | Matrix `dp[i][j]` match (diagonal+1) vs mismatch (max) |
| 35 | LC 300 | Longest Increasing Subsequence (LIS) | 1D DP / Binary Search | Element height bars + DP array dependency arrows |

---

### 8. Trie & Heaps
* **Visualizer Archetype**: `Character Tree Branching` & `Heap Binary Tree / Array`

| # | LeetCode # | Problem Name | Core Pattern | Visualizer Focus |
|---|------------|--------------|--------------|------------------|
| 36 | LC 208 | Implement Trie (Prefix Tree) | N-Ary Character Tree | Character node insertion & `isEnd` flag highlights |
| 37 | LC 215 | Kth Largest Element | Min-Heap / Max-Heap | Binary Heap Tree <-> Array Index mapping + Percolate Up/Down |
| 38 | LC 295 | Find Median from Data Stream | Dual Heaps (Max & Min) | Left Max-Heap & Right Min-Heap balancing animation |

---

## 🏗️ Reusable Visualizer Component Architecture

To make these visualizers modular so they can be imported into your main Striver A2Z project:

1. **`VisualizerContainer`**: Generic header + Top Control Deck (Play, Pause, Step, Speed, Preset Selector, Layout Switcher).
2. **`ShikiCodeRunner`**: Tokyo-Night highlighted code runner with auto-centering laser pointer.
3. **Core Visual Engine Components**:
   - `ArrayRail` (for Two Pointers, Sliding Window, Kadane, Binary Search)
   - `LinkedListConduit` (for LL Pointer flips)
   - `StackChamber` (for Monotonic Stack & Recursion)
   - `TreeGraphCanvas` (for Trees & BSTs)
   - `GraphMeshCanvas` (for BFS, DFS, Dijkstra, Topo Sort)
   - `GridDPMatrix` (for 2D DP table computation)
