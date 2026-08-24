/**
 * ============================================================================
 * 🌳 BINARY TREE POSTORDER TRAVERSAL — TWO-PHASE / MARKER STACK ALGORITHM
 * ============================================================================
 *
 * 🎯 The Core Philosophy:
 * Desired Execution Order: LEFT SUBTREE -> RIGHT SUBTREE -> ROOT
 *
 * Because a Stack is LIFO (Last-In, First-Out), work must be scheduled
 * in REVERSE order onto the stack:
 *
 * 1. PUSH ROOT with phase: 'visit'   -> (Pushed FIRST so it executes LAST)
 * 2. PUSH RIGHT with phase: 'expand' -> (Pushed SECOND so it executes after Left)
 * 3. PUSH LEFT with phase: 'expand'  -> (Pushed LAST so it sits on TOP and executes FIRST)
 */

export namespace BinaryTreePostorder {
  /**
   * Definition for a binary tree node.
   */
  export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
      this.val = val === undefined ? 0 : val;
      this.left = left === undefined ? null : left;
      this.right = right === undefined ? null : right;
    }
  }

  /**
   * Traversal Frame representing a state in the iterative execution engine.
   */
  export interface TraversalFrame {
    node: TreeNode;
    phase: 'expand' | 'visit';
  }

  /**
   * Postorder Traversal using Iterative State Machine (Expand & Visit Phases)
   *
   * Time Complexity:  O(N) - Har node exactly do baar stack me aati hai (expand + visit).
   * Space Complexity: O(H) - Maximum stack depth tree ki height (H) ke proportional hoti hai.
   *
   * @param root - Root of the binary tree
   * @returns Array of node values in Postorder sequence
   */
  export function postorderTraversal(root: TreeNode | null): number[] {
    // Base Case: Agar tree empty hai to seedha empty array return karo
    if (root === null) {
      return [];
    }

    const result: number[] = [];
    // Stack initialization with root node in 'expand' phase
    const stack: TraversalFrame[] = [{ node: root, phase: 'expand' }];

    while (stack.length > 0) {
      const frame = stack.pop()!;
      const current = frame.node;

      // -------------------------------------------------------------
      // PHASE 1: VISIT (Node is ready to be consumed)
      // -------------------------------------------------------------
      if (frame.phase === 'visit') {
        // Ye marker children ke neeche push hua tha.
        // Ab marker top par wapas aaya, meaning left aur right work complete hai.
        result.push(current.val);
        continue;
      }

      // -------------------------------------------------------------
      // PHASE 2: EXPAND (Schedule children & root marker in LIFO order)
      // -------------------------------------------------------------
      // Desired execution LEFT -> RIGHT -> ROOT hai.
      // Stack LIFO hone ki wajah se work reverse order me schedule hota hai:

      // 1. Root visit sabse last chahiye, so iska marker sabse pehle/bottom push hota hai.
      stack.push({ node: current, phase: 'visit' });

      // 2. Right left ke baad execute chahiye, so right ko left se pehle push karte hain.
      if (current.right !== null) {
        stack.push({ node: current.right, phase: 'expand' });
      }

      // 3. Left last push hokar stack top par aata hai,
      // isliye current node ka next executed subtree left hoga.
      if (current.left !== null) {
        stack.push({ node: current.left, phase: 'expand' });
      }
    }

    return result;
  }

  // ============================================================================
  // 🧪 COMPREHENSIVE TEST SUITE
  // ============================================================================
  export function runTests(): void {
    console.log('🚀 Running Binary Tree Postorder Traversal Tests...\n');

    // Helper: Build tree from array (BFS Level-Order)
    function buildTree(arr: (number | null)[]): TreeNode | null {
      if (arr.length === 0 || arr[0] === null) return null;
      const root = new TreeNode(arr[0]);
      const queue: TreeNode[] = [root];
      let i = 1;

      while (queue.length > 0 && i < arr.length) {
        const curr = queue.shift()!;

        // Left Child
        if (i < arr.length && arr[i] !== null) {
          curr.left = new TreeNode(arr[i]!);
          queue.push(curr.left);
        }
        i++;

        // Right Child
        if (i < arr.length && arr[i] !== null) {
          curr.right = new TreeNode(arr[i]!);
          queue.push(curr.right);
        }
        i++;
      }

      return root;
    }

    // Helper: Assert equality
    function assertEqual(actual: number[], expected: number[], testName: string) {
      const match =
        actual.length === expected.length &&
        actual.every((val, idx) => val === expected[idx]);

      if (match) {
        console.log(`✅ [PASS] ${testName}`);
        console.log(`   Output: [${actual.join(', ')}]\n`);
      } else {
        console.error(`❌ [FAIL] ${testName}`);
        console.error(`   Expected: [${expected.join(', ')}]`);
        console.error(`   Actual:   [${actual.join(', ')}]\n`);
      }
    }

    // Test 1: Standard Balanced Binary Tree
    //       1
    //      / \
    //     2   3
    //    / \   \
    //   4   5   6
    // Postorder: [4, 5, 2, 6, 3, 1]
    const tree1 = buildTree([1, 2, 3, 4, 5, null, 6]);
    assertEqual(postorderTraversal(tree1), [4, 5, 2, 6, 3, 1], 'Test 1: Standard 6-Node Tree');

    // Test 2: Minimal 3-Node Tree
    //     1
    //    / \
    //   2   3
    // Postorder: [2, 3, 1]
    const tree2 = buildTree([1, 2, 3]);
    assertEqual(postorderTraversal(tree2), [2, 3, 1], 'Test 2: Minimal 3-Node Tree');

    // Test 3: Left-Skewed Tree
    //     1
    //    /
    //   2
    //  /
    // 3
    // Postorder: [3, 2, 1]
    const tree3 = buildTree([1, 2, null, 3]);
    assertEqual(postorderTraversal(tree3), [3, 2, 1], 'Test 3: Left-Skewed Tree');

    // Test 4: Single Node Tree
    const tree4 = buildTree([42]);
    assertEqual(postorderTraversal(tree4), [42], 'Test 4: Single Node Tree');

    // Test 5: Empty Tree (null root)
    const tree5 = buildTree([]);
    assertEqual(postorderTraversal(tree5), [], 'Test 5: Empty Tree (Null Root)');

    console.log('🎉 All test cases executed successfully!');
  }
}

// Run test cases if executed directly
if (typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module) {
  BinaryTreePostorder.runTests();
}
