/**
 * ============================================================================
 * Problem: LeetCode 75 - Sort Colors (Sort 0s, 1s, and 2s)
 * Approach: Dutch National Flag Algorithm (Optimal 3-Pointer Technique)
 * Time Complexity: O(N) — Single pass traversal
 * Space Complexity: O(1) — In-place array modification
 * ============================================================================
 * 
 * INTUITION & WHY THIS WORKS:
 * The array is virtually divided into 4 contiguous sections using 3 pointers:
 * 1. [0 ... low - 1]     ---> All 0s (Red)
 * 2. [low ... mid - 1]   ---> All 1s (White)
 * 3. [mid ... high]      ---> Unprocessed / Unknown elements
 * 4. [high + 1 ... n - 1]---> All 2s (Blue)
 * 
 * Rules during mid traversal:
 * - If nums[mid] == 0: Swap(nums[low], nums[mid]), low++, mid++
 * - If nums[mid] == 1: mid++
 * - If nums[mid] == 2: Swap(nums[mid], nums[high]), high-- (do NOT increment mid yet)
 */

export namespace SortColorsSolution {
  /**
   * Sorts an array containing only 0s, 1s, and 2s in-place using Dutch National Flag Algorithm.
   * @param nums Array of 0s, 1s, and 2s
   */
  export function sortColors(nums: number[]): void {
    if (!nums || nums.length <= 1) return;

    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    // Process elements until mid pointer crosses high pointer
    while (mid <= high) {
      if (nums[mid] === 0) {
        // Case 1: Found a 0 -> Swap to the low region and expand both low and mid
        [nums[low], nums[mid]] = [nums[mid], nums[low]];
        low++;
        mid++;
      } else if (nums[mid] === 1) {
        // Case 2: Found a 1 -> Already in correct middle region, just move mid
        mid++;
      } else {
        // Case 3: Found a 2 -> Swap to the high region and shrink high
        // Note: mid is NOT incremented because the swapped element at mid must be evaluated!
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        high--;
      }
    }
  }

  /**
   * Comprehensive Test Runner with Dry Run Verification
   */
  export function runTests(): void {
    console.log('====================================================');
    console.log('🧪 Running Test Cases for LeetCode 75: Sort Colors');
    console.log('====================================================');

    const testCases: { name: string; input: number[]; expected: number[] }[] = [
      {
        name: 'Standard Mixed Array',
        input: [2, 0, 2, 1, 1, 0],
        expected: [0, 0, 1, 1, 2, 2],
      },
      {
        name: 'Small 3-Element Array',
        input: [2, 0, 1],
        expected: [0, 1, 2],
      },
      {
        name: 'Single Element 0',
        input: [0],
        expected: [0],
      },
      {
        name: 'Already Sorted Array',
        input: [0, 0, 1, 1, 2, 2],
        expected: [0, 0, 1, 1, 2, 2],
      },
      {
        name: 'Reverse Sorted Array',
        input: [2, 2, 1, 1, 0, 0],
        expected: [0, 0, 1, 1, 2, 2],
      },
      {
        name: 'All Identical Elements (All 2s)',
        input: [2, 2, 2, 2],
        expected: [2, 2, 2, 2],
      },
      {
        name: 'Two Elements Swapped',
        input: [1, 0],
        expected: [0, 1],
      },
    ];

    let passed = 0;
    testCases.forEach((tc, idx) => {
      const arrCopy = [...tc.input];
      sortColors(arrCopy);
      const isCorrect = JSON.stringify(arrCopy) === JSON.stringify(tc.expected);

      if (isCorrect) {
        passed++;
        console.log(`✅ Test ${idx + 1} Passed [${tc.name}]: Input [${tc.input.join(', ')}] -> Output [${arrCopy.join(', ')}]`);
      } else {
        console.error(`❌ Test ${idx + 1} Failed [${tc.name}]: Expected [${tc.expected.join(', ')}], got [${arrCopy.join(', ')}]`);
      }
    });

    console.log(`\n🎉 Test Suite Completed: ${passed} / ${testCases.length} Tests Passed!`);
  }
}

// Run test suite automatically if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  SortColorsSolution.runTests();
}
