/**
 * ============================================================================
 * Problem: LeetCode 42 - Trapping Rain Water
 * Approach: Optimal Two Pointers (LeftMax & RightMax Invariant)
 * Time Complexity: O(N) — Single pass inward scan
 * Space Complexity: O(1) — Constant extra space
 * ============================================================================
 *
 * INTUITION & WHY THIS WORKS:
 * Water trapped over any bar 'i' depends on min(leftMax, rightMax) - height[i].
 * With two pointers (left at 0, right at n-1):
 * - If height[left] <= height[right], we are GUARANTEED that the right side has a wall
 *   at least as tall as height[left]. Thus, leftMax determines the water trapped at 'left'!
 * - If height[right] < height[left], the left side has a wall at least as tall as height[right],
 *   so rightMax determines the water trapped at 'right'!
 */

export namespace TrappingRainWaterSolution {
  export interface TrappingResult {
    totalWater: number;
    waterPerBar: number[];
  }

  /**
   * Calculates the total trapped water and detailed per-bar trapped amount.
   * @param height Elevation map array
   */
  export function trap(height: number[]): TrappingResult {
    if (!height || height.length < 3) {
      return { totalWater: 0, waterPerBar: new Array(height ? height.length : 0).fill(0) };
    }

    const n = height.length;
    const waterPerBar: number[] = new Array(n).fill(0);
    let left = 0;
    let right = n - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;

    while (left <= right) {
      if (height[left] <= height[right]) {
        // Bottleneck is on the left side
        if (height[left] >= leftMax) {
          // New maximum wall found on left, cannot trap water on this peak
          leftMax = height[left];
        } else {
          // Trapped water bounded by leftMax
          const trapped = leftMax - height[left];
          waterPerBar[left] = trapped;
          totalWater += trapped;
        }
        left++;
      } else {
        // Bottleneck is on the right side
        if (height[right] >= rightMax) {
          // New maximum wall found on right, cannot trap water on this peak
          rightMax = height[right];
        } else {
          // Trapped water bounded by rightMax
          const trapped = rightMax - height[right];
          waterPerBar[right] = trapped;
          totalWater += trapped;
        }
        right--;
      }
    }

    return { totalWater, waterPerBar };
  }

  /**
   * Comprehensive Test Runner with Dry Run Verification
   */
  export function runTests(): void {
    console.log('====================================================');
    console.log("🧪 Running Test Cases for LeetCode 42: Trapping Rain Water");
    console.log('====================================================');

    const testCases: { name: string; input: number[]; expected: number }[] = [
      {
        name: 'Standard LeetCode Example 1',
        input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
        expected: 6,
      },
      {
        name: 'Deep Basin with High Boundary (Example 2)',
        input: [4, 2, 0, 3, 2, 5],
        expected: 9,
      },
      {
        name: 'Strictly Decreasing Heights (No Water Trapped)',
        input: [4, 3, 2, 1, 0],
        expected: 0,
      },
      {
        name: 'Strictly Increasing Heights (No Water Trapped)',
        input: [0, 1, 2, 3, 4],
        expected: 0,
      },
      {
        name: 'Simple U-Shaped Basin',
        input: [5, 0, 5],
        expected: 5,
      },
      {
        name: 'Small / Empty Array',
        input: [2, 1],
        expected: 0,
      },
    ];

    let passed = 0;
    testCases.forEach((tc, idx) => {
      const res = trap(tc.input);
      const isCorrect = res.totalWater === tc.expected;

      if (isCorrect) {
        passed++;
        console.log(
          `✅ Test ${idx + 1} Passed [${tc.name}]: Trapped Water = ${res.totalWater} units | Per bar: [${res.waterPerBar.join(', ')}]`
        );
      } else {
        console.error(
          `❌ Test ${idx + 1} Failed [${tc.name}]: Expected ${tc.expected}, got ${res.totalWater}`
        );
      }
    });

    console.log(`\n🎉 Test Suite Completed: ${passed} / ${testCases.length} Tests Passed!`);
  }
}

// Run test suite automatically if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  TrappingRainWaterSolution.runTests();
}
