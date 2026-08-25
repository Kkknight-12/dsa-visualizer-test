import { ArrayBlockElement } from '@/components/common/ReorderableArrayRail';

export interface NextPermutationStep {
  stepNumber: number;
  activeLine: number;
  nums: number[];
  arraySnapshot: ArrayBlockElement[];
  pivotIndex: number | null;
  swapIndex: number | null;
  scanningIndex: number | null;
  swappingIndices: [number, number] | null;
  reverseRange: [number, number] | null;
  actionType:
    | 'init'
    | 'scan_pivot'
    | 'pivot_found'
    | 'no_pivot'
    | 'scan_swap'
    | 'swap_found'
    | 'do_swap'
    | 'do_reverse'
    | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface NextPermutationPreset {
  id: string;
  name: string;
  description: string;
  nums: number[];
}

export const NEXT_PERMUTATION_PRESETS: NextPermutationPreset[] = [
  {
    id: 'standard-mixed',
    name: 'Standard Mixed [1, 3, 5, 4, 2]',
    description: 'Pivot at i=1 (val 3), swap with j=3 (val 4), reverse suffix [5, 3, 2].',
    nums: [1, 3, 5, 4, 2],
  },
  {
    id: 'basic-ascending',
    name: 'Basic Ascending [1, 2, 3]',
    description: 'Simple 3-element permutation leading to [1, 3, 2].',
    nums: [1, 2, 3],
  },
  {
    id: 'entirely-descending',
    name: 'Entirely Descending [3, 2, 1]',
    description: 'Edge case! No pivot exists. Reverses back to sorted [1, 2, 3].',
    nums: [3, 2, 1],
  },
  {
    id: 'duplicates',
    name: 'With Duplicates [1, 1, 5]',
    description: 'Handles non-strict comparisons correctly.',
    nums: [1, 1, 5],
  },
  {
    id: 'complex-peak',
    name: 'Complex Peak [2, 4, 1, 7, 5, 3, 1]',
    description: 'Longer array demonstrating 3-step pivot, swap, and suffix reverse.',
    nums: [2, 4, 1, 7, 5, 3, 1],
  },
];

export function generateNextPermutationSteps(initialNums: number[]): NextPermutationStep[] {
  const steps: NextPermutationStep[] = [];
  const nums = [...initialNums];
  const n = nums.length;

  // Initialize persistent ArrayBlockElements for physical FLIP sliding motion
  let arraySnapshot: ArrayBlockElement[] = initialNums.map((val, idx) => ({
    id: `np-elem-${idx}-${val}`,
    val,
  }));

  const getSnapshotCopy = () => JSON.parse(JSON.stringify(arraySnapshot));

  // Step 1: Initial state
  steps.push({
    stepNumber: 1,
    activeLine: 2,
    nums: [...nums],
    arraySnapshot: getSnapshotCopy(),
    pivotIndex: null,
    swapIndex: null,
    scanningIndex: null,
    swappingIndices: null,
    reverseRange: null,
    actionType: 'init',
    actionTitle: 'Initialize Next Permutation Search',
    hinglishNarration: `Input array [${nums.join(', ')}] load hua. Ab Right-to-Left sweep karke pehla breakpoint pivot (nums[i] < nums[i+1]) dhoondenge.`,
    whyRule: 'Lexicographically next permutation ke liye right side se pehla strictly decreasing trend break marker dhoondna zaroori hai.',
  });

  if (n <= 1) {
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 3,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: null,
      swapIndex: null,
      scanningIndex: null,
      swappingIndices: null,
      reverseRange: null,
      actionType: 'complete',
      actionTitle: 'Array Size <= 1 (No Permutation Needed)',
      hinglishNarration: 'Array me 1 ya 0 elements hain, isliye turant return kar diya.',
      whyRule: 'Single element array ka next permutation self hota hai.',
    });
    return steps;
  }

  // STEP 1: Scan right-to-left for pivot i (nums[i] < nums[i+1])
  let i = n - 2;

  while (i >= 0 && nums[i] >= nums[i + 1]) {
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 7,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: null,
      swapIndex: null,
      scanningIndex: i,
      swappingIndices: null,
      reverseRange: null,
      actionType: 'scan_pivot',
      actionTitle: `Scan Index i=${i} (val=${nums[i]} >= nums[${i + 1}]=${nums[i + 1]})`,
      hinglishNarration: `Index ${i} (val=${nums[i]}) right neighbor ${i + 1} (val=${nums[i + 1]}) se bada ya barabar hai. Descending peak continuous hai, isliye left index ${i - 1} check karenge.`,
      whyRule: 'Jab tak right neighbor se element bada/equal hai, tab tak array descending order me hai. Hum break point scan kar rahe hain.',
    });
    i--;
  }

  if (i >= 0) {
    // Found Breakpoint i!
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 12,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: i,
      swapIndex: null,
      scanningIndex: i,
      swappingIndices: null,
      reverseRange: null,
      actionType: 'pivot_found',
      actionTitle: `🎯 Pivot Breakpoint Found at Index i=${i} (val=${nums[i]})`,
      hinglishNarration: `Breakpoint mil gaya! Index ${i} (val=${nums[i]}) is strictly less than Index ${i + 1} (val=${nums[i + 1]}). Yeh humara Pivot is!`,
      whyRule: 'Yeh index batata hai ki iske right me sabse bada possible suffix layout ho chuka hai. Ab is index par next greater element place karenge.',
    });

    // STEP 2: Find rightmost j such that nums[j] > nums[i]
    let j = n - 1;
    while (j > i && nums[j] <= nums[i]) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 16,
        nums: [...nums],
        arraySnapshot: getSnapshotCopy(),
        pivotIndex: i,
        swapIndex: null,
        scanningIndex: j,
        swappingIndices: null,
        reverseRange: null,
        actionType: 'scan_swap',
        actionTitle: `Scan Right Suffix Index j=${j} (val=${nums[j]} <= Pivot ${nums[i]})`,
        hinglishNarration: `Index ${j} (val=${nums[j]}) Pivot val ${nums[i]} se bada nahi hai. Suffix me left move karke j=${j - 1} check karenge.`,
        whyRule: 'Pivot element ko adjust karne ke liye Right Suffix se just-greater element dhoondna hota hai.',
      });
      j--;
    }

    // Found Swapper j!
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 19,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: i,
      swapIndex: j,
      scanningIndex: j,
      swappingIndices: null,
      reverseRange: null,
      actionType: 'swap_found',
      actionTitle: `✨ Swapper Found at Index j=${j} (val=${nums[j]} > Pivot ${nums[i]})`,
      hinglishNarration: `Just-greater element mil gaya! Index j=${j} (val=${nums[j]}) is greater than Pivot nums[${i}] (${nums[i]}).`,
      whyRule: 'Lexicographically next smallest jump lene ke liye Suffix me se pehla (smallest greater) element pick kiya jata hai.',
    });

    // STEP 3: Swap nums[i] and nums[j] in both nums array and arraySnapshot (Triggers FLIP physical sliding motion!)
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;

    const tempBlock = arraySnapshot[i];
    arraySnapshot[i] = arraySnapshot[j];
    arraySnapshot[j] = tempBlock;

    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 21,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: i,
      swapIndex: j,
      scanningIndex: null,
      swappingIndices: [i, j],
      reverseRange: null,
      actionType: 'do_swap',
      actionTitle: `🔄 Swap Pivot nums[${i}] (${temp}) ↔ Swapper nums[${j}] (${nums[i]})`,
      hinglishNarration: `Index ${i} aur Index ${j} ko swap kiya! Block FLIP animation triggers! Array ab: [${nums.join(', ')}].`,
      whyRule: 'Pivot position par just-greater value aa gayi hai. Ab right suffix ko smallest order me convert karna hai.',
    });
  } else {
    // Edge case: No pivot found (Array was fully descending like [3, 2, 1])
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 12,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: null,
      swapIndex: null,
      scanningIndex: null,
      swappingIndices: null,
      reverseRange: null,
      actionType: 'no_pivot',
      actionTitle: '⚠️ No Pivot Found (Array is Fully Descending)',
      hinglishNarration: 'Koi index i nahi mila jahan nums[i] < nums[i+1] ho. Matlab array peak maximum permutation hai! Entire array reverse ho jayegi.',
      whyRule: 'Jab array strictly non-increasing ho, toh next permutation smallest sorted ascending array (reverse) hota hai.',
    });
  }

  // STEP 4: Reverse suffix from (i + 1) to (n - 1)
  const startRev = i + 1;
  const endRev = n - 1;

  if (startRev < endRev) {
    let left = startRev;
    let right = endRev;
    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;

      const tb = arraySnapshot[left];
      arraySnapshot[left] = arraySnapshot[right];
      arraySnapshot[right] = tb;

      left++;
      right--;
    }

    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 25,
      nums: [...nums],
      arraySnapshot: getSnapshotCopy(),
      pivotIndex: i >= 0 ? i : null,
      swapIndex: null,
      scanningIndex: null,
      swappingIndices: null,
      reverseRange: [startRev, endRev],
      actionType: 'do_reverse',
      actionTitle: `🔁 Reverse Right Suffix Subarray [${startRev} ... ${endRev}]`,
      hinglishNarration: `Right Suffix (Index ${startRev} to ${endRev}) ko reverse kar diya! Block FLIP animation updates positions. Array ab: [${nums.join(', ')}].`,
      whyRule: 'Suffix initially descending tha. Reverse karne par woh smallest ascending sequence me badal jata hai, jo next permutation banata hai.',
    });
  }

  // Final Step: Completion
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 28,
    nums: [...nums],
    arraySnapshot: getSnapshotCopy(),
    pivotIndex: i >= 0 ? i : null,
    swapIndex: null,
    scanningIndex: null,
    swappingIndices: null,
    reverseRange: null,
    actionType: 'complete',
    actionTitle: '🎉 Next Permutation Complete!',
    hinglishNarration: `Successfully computed Next Permutation: [${nums.join(', ')}].`,
    whyRule: 'In-place 3-step lexicographical algorithm completed in O(N) time and O(1) space.',
  });

  return steps;
}
