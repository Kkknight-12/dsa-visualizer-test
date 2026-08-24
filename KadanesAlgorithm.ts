/**
 * ============================================================================
 * Problem: LeetCode 53 - Maximum Subarray (Kadane's Algorithm)
 * Approach: Optimal Greedy Traversal (Kadane's Algorithm)
 * Time Complexity: O(N) — Single pass traversal
 * Space Complexity: O(1) — In-place tracking without extra space
 * ============================================================================
 * 
 * INTUITION & WHY THIS WORKS:
 * If a prefix subarray sum becomes negative (< 0), it can NEVER contribute positively
 * to any future contiguous subarray sum. Therefore, whenever running sum drops below 0,
 * we reset `sum = 0` and start a fresh candidate subarray from the next element.
 */

export namespace KadanesSolution {
  export interface KadanesResult {
    maxSum: number;
    startIndex: number;
    endIndex: number;
    subArray: number[];
  }

  /**
   * Calculates the maximum contiguous subarray sum and returns the subarray indices.
   * @param nums Array of integers (can contain positive and negative numbers)
   */
  export function maxSubArray(nums: number[]): KadanesResult {
    if (!nums || nums.length === 0) {
      return { maxSum: 0, startIndex: -1, endIndex: -1, subArray: [] };
    }

    let maxSum = -Infinity;
    let sum = 0;
    let startIndex = 0;
    let endIndex = 0;
    let tempStart = 0;

    for (let i = 0; i < nums.length; i++) {
      // 1. If running sum was 0, set candidate start index to current position
      if (sum === 0) {
        tempStart = i;
      }

      // 2. Add current element to running sum
      sum += nums[i];

      // 3. Update global maximum sum & boundaries if current sum is strictly greater
      if (sum > maxSum) {
        maxSum = sum;
        startIndex = tempStart;
        endIndex = i;
      }

      // 4. If running sum becomes negative, discard prefix and reset sum to 0
      if (sum < 0) {
        sum = 0;
      }
    }

    return {
      maxSum,
      startIndex,
      endIndex,
      subArray: nums.slice(startIndex, endIndex + 1),
    };
  }

  /**
   * Comprehensive Test Runner with Dry Run Verification
   */
  export function runTests(): void {
    console.log('====================================================');
    console.log("🧪 Running Test Cases for LeetCode 53: Kadane's Algorithm");
    console.log('====================================================');

    const testCases: { name: string; input: number[]; expectedSum: number }[] = [
      {
        name: 'Standard Mixed Array (LeetCode Example 1)',
        input: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
        expectedSum: 6, // Subarray [4, -1, 2, 1]
      },
      {
        name: 'Single Positive Element',
        input: [1],
        expectedSum: 1,
      },
      {
        name: 'All Positive Array',
        input: [5, 4, -1, 7, 8],
        expectedSum: 23,
      },
      {
        name: 'All Negative Array',
        input: [-5, -2, -8, -1, -4],
        expectedSum: -1, // Subarray [-1]
      },
      {
        name: 'Alternating Signs',
        input: [-2, 3, -1, 2, -3],
        expectedSum: 4, // Subarray [3, -1, 2]
      },
    ];

    let passed = 0;
    testCases.forEach((tc, idx) => {
      const res = maxSubArray(tc.input);
      const isCorrect = res.maxSum === tc.expectedSum;

      if (isCorrect) {
        passed++;
        console.log(
          `✅ Test ${idx + 1} Passed [${tc.name}]: MaxSum = ${res.maxSum}, Range [${res.startIndex}...${res.endIndex}] -> Subarray [${res.subArray.join(', ')}]`
        );
      } else {
        console.error(
          `❌ Test ${idx + 1} Failed [${tc.name}]: Expected MaxSum = ${tc.expectedSum}, got ${res.maxSum}`
        );
      }
    });

    console.log(`\n🎉 Test Suite Completed: ${passed} / ${testCases.length} Tests Passed!`);
  }
}

// Run test suite automatically if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  KadanesSolution.runTests();
}
