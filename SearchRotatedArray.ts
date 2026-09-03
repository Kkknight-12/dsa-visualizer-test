/**
 * LeetCode 33: Search in Rotated Sorted Array
 * 
 * Sawaal Summary:
 * Hume ek sorted array diya hai jo unknown pivot par rotate ho gaya hai.
 * Hume target element ka index find karna hai O(log N) runtime mein.
 * Agar element nahi milta, toh -1 return karna hai.
 */

export namespace SearchRotatedArraySolution {
  /**
   * Optimal Single-Pass Modified Binary Search
   * 
   * Intuition:
   * Array ko jab bhi mid par todte hain, AT LEAST EK HALF hamesha strictly sorted rehta hai:
   * 1. Agar nums[low] <= nums[mid] hai -> Left Half [low ... mid] 100% sorted hai.
   *    - Agar target left half ke boundary ke andar lie karta hai (nums[low] <= target < nums[mid]),
   *      toh target left half mein hi hoga -> high = mid - 1.
   *    - Warna target right half mein hoga -> low = mid + 1.
   * 2. Warna Right Half [mid ... high] 100% sorted hoga.
   *    - Agar target right half ke boundary ke andar lie karta hai (nums[mid] < target <= nums[high]),
   *      toh target right half mein hi hoga -> low = mid + 1.
   *    - Warna target left half mein hoga -> high = mid - 1.
   * 
   * Time Complexity: O(log N) - Har iteration mein search space half ho jaata hai.
   * Space Complexity: O(1) - Purely iterative, zero extra space.
   */
  export function search(nums: number[], target: number): number {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);

      // Target match check
      if (nums[mid] === target) {
        return mid;
      }

      // CASE 1: Check if LEFT half [low ... mid] is sorted
      if (nums[low] <= nums[mid]) {
        // Kya target is sorted left half ke bounds mein hai?
        if (target >= nums[low] && target < nums[mid]) {
          // Target left half mein present hai, eliminate right half
          high = mid - 1;
        } else {
          // Target left half mein nahi ho sakta, eliminate left half
          low = mid + 1;
        }
      }
      // CASE 2: Warna RIGHT half [mid ... high] MUST be sorted
      else {
        // Kya target is sorted right half ke bounds mein hai?
        if (target > nums[mid] && target <= nums[high]) {
          // Target right half mein present hai, eliminate left half
          low = mid + 1;
        } else {
          // Target right half mein nahi ho sakta, eliminate right half
          high = mid - 1;
        }
      }
    }

    // Target array mein present nahi hai
    return -1;
  }
}

// -------------------------------------------------------------
// Comprehensive Test Suite & Verification Runner
// -------------------------------------------------------------
function runTests() {
  console.log('🧪 Running Test Suite for LeetCode 33: Search in Rotated Sorted Array...');

  const testCases: {
    nums: number[];
    target: number;
    expected: number;
    description: string;
  }[] = [
    {
      nums: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      expected: 4,
      description: 'Example 1: Target in right unrotated partition',
    },
    {
      nums: [4, 5, 6, 7, 0, 1, 2],
      target: 3,
      expected: -1,
      description: 'Example 2: Target does not exist in array',
    },
    {
      nums: [1],
      target: 0,
      expected: -1,
      description: 'Example 3: Single element array, target not found',
    },
    {
      nums: [1],
      target: 1,
      expected: 0,
      description: 'Single element array, target found at index 0',
    },
    {
      nums: [4, 5, 6, 7, 0, 1, 2],
      target: 6,
      expected: 2,
      description: 'Target in left sorted partition',
    },
    {
      nums: [5, 1, 3],
      target: 5,
      expected: 0,
      description: 'Small array with pivot near start, target at index 0',
    },
    {
      nums: [6, 7, 8, 1, 2, 3, 4, 5],
      target: 8,
      expected: 2,
      description: 'Target is the maximum element before rotation drop',
    },
    {
      nums: [6, 7, 8, 1, 2, 3, 4, 5],
      target: 1,
      expected: 3,
      description: 'Target is the minimum element right after rotation drop',
    },
  ];

  let passed = 0;
  for (const [idx, tc] of testCases.entries()) {
    const result = SearchRotatedArraySolution.search(tc.nums, tc.target);
    const isPass = result === tc.expected;
    if (isPass) {
      passed++;
      console.log(`✅ Test ${idx + 1} PASSED: ${tc.description}`);
    } else {
      console.error(
        `❌ Test ${idx + 1} FAILED: ${tc.description} | Expected ${tc.expected}, Got ${result}`
      );
    }
  }

  console.log(`\n🎉 Test Results: ${passed}/${testCases.length} Tests Passed Cleanly!\n`);
  if (passed !== testCases.length) {
    process.exit(1);
  }
}

// Run tests when executed directly
runTests();
