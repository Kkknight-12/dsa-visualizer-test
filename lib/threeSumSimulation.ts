export interface ArrayElement {
  id: string; // Unique persistent ID for Framer Motion physical FLIP block sliding
  val: number;
}

export interface PointerMovement {
  type: 'init' | 'sort' | 'i_advance' | 'left_advance' | 'right_shrink' | 'duplicate_skip' | 'both_contract' | 'early_exit' | 'none';
  label: string; // e.g. "LEFT POINTER (left++)"
  direction: 'right' | 'left' | 'none';
  fromIdx?: number;
  toIdx?: number;
  reason: string; // e.g. "Sum (-3) < 0 → Move left++ to increase sum"
}

export interface ThreeSumStep {
  stepNumber: number;
  activeLine: number;
  arraySnapshot: ArrayElement[];
  i: number;
  left: number;
  right: number;
  targetSum: number; // Always 0
  requiredPairSum: number; // -nums[i] (target for nums[left] + nums[right])
  currentPairSum: number; // nums[left] + nums[right]
  currentSum: number; // nums[i] + nums[left] + nums[right]
  sumStatus: 'MATCH' | 'TOO_LOW' | 'TOO_HIGH' | 'NONE';
  pointerMovement: PointerMovement;
  foundTriplets: number[][];
  newlyFoundTriplet?: number[];
  swappingIndices?: [number, number];
  actionType:
    | 'init'
    | 'sort'
    | 'anchor_init'
    | 'anchor_skip'
    | 'early_stop'
    | 'check_sum'
    | 'triplet_found'
    | 'advance_left'
    | 'shrink_right'
    | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface ThreeSumPreset {
  id: string;
  name: string;
  initialArray: number[];
}

export const THREE_SUM_PRESETS: ThreeSumPreset[] = [
  {
    id: 'preset-standard',
    name: 'Standard Mixed [-1, 0, 1, 2, -1, -4]',
    initialArray: [-1, 0, 1, 2, -1, -4],
  },
  {
    id: 'preset-duplicates',
    name: 'Duplicates Heavy [-2, 0, 0, 2, 2]',
    initialArray: [-2, 0, 0, 2, 2],
  },
  {
    id: 'preset-[#0,0,0,0]',
    name: 'Multiple Zero Quadruplet [0, 0, 0, 0]',
    initialArray: [0, 0, 0, 0],
  },
  {
    id: 'preset-no-solution',
    name: 'No Zero Triplet [1, 2, -1, 3]',
    initialArray: [1, 2, -1, 3],
  },
];

export const THREE_SUM_CODE_SNIPPET = `function threeSum(nums: number[]): number[][] {
  const n = nums.length;
  if (n < 3) return [];

  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    if (nums[i] + nums[i + 1] + nums[i + 2] > 0) break;
    if (nums[i] + nums[n - 2] + nums[n - 1] < 0) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      }
    }
  }

  return result;
}`;

export function generateThreeSumSteps(initialArray: number[]): ThreeSumStep[] {
  const steps: ThreeSumStep[] = [];
  const foundTriplets: number[][] = [];

  // Step 1: Assign persistent IDs to original elements
  let elements: ArrayElement[] = initialArray.map((val, idx) => ({
    id: `3sum-${idx}-${val}`,
    val,
  }));

  // Initial step
  steps.push({
    stepNumber: 1,
    activeLine: 1,
    arraySnapshot: elements.map((e) => ({ ...e })),
    i: 0,
    left: 1,
    right: elements.length - 1,
    targetSum: 0,
    requiredPairSum: -elements[0].val,
    currentPairSum: (elements[1]?.val || 0) + (elements[elements.length - 1]?.val || 0),
    currentSum: elements[0].val + (elements[1]?.val || 0) + (elements[elements.length - 1]?.val || 0),
    sumStatus: 'NONE',
    pointerMovement: {
      type: 'init',
      label: 'INITIALIZE',
      direction: 'none',
      reason: 'Algorithm starting with raw unsorted input array',
    },
    foundTriplets: [],
    actionType: 'init',
    actionTitle: '1. Unsorted Input Array Received',
    hinglishNarration: `Input array: [${initialArray.join(', ')}]. 3Sum algorithm initialize ho raha hai.`,
    whyRule: '3Sum problem ko O(N^2) me solve karne ke liye pehla mandatory step array ko ascending order me sort karna hai.',
  });

  const n = elements.length;
  if (n < 3) {
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 3,
      arraySnapshot: elements.map((e) => ({ ...e })),
      i: 0,
      left: 0,
      right: 0,
      targetSum: 0,
      requiredPairSum: 0,
      currentPairSum: 0,
      currentSum: 0,
      sumStatus: 'NONE',
      pointerMovement: {
        type: 'early_exit',
        label: 'EARLY EXIT (N < 3)',
        direction: 'none',
        reason: 'Array length is less than 3, cannot form any triplet',
      },
      foundTriplets: [],
      actionType: 'complete',
      actionTitle: 'Array length < 3. Terminated early.',
      hinglishNarration: 'Array me kam se kam 3 elements hona zaroori hai triplet banane ke liye.',
      whyRule: 'Triplet validation requires 3 distinct indices.',
    });
    return steps;
  }

  // Step 2: Sort the array (preserve element identities by sorting persistent block objects)
  elements = [...elements].sort((a, b) => a.val - b.val);

  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 5,
    arraySnapshot: elements.map((e) => ({ ...e })),
    i: 0,
    left: 1,
    right: elements.length - 1,
    targetSum: 0,
    requiredPairSum: -elements[0].val,
    currentPairSum: elements[1].val + elements[elements.length - 1].val,
    currentSum: elements[0].val + elements[1].val + elements[elements.length - 1].val,
    sumStatus: 'NONE',
    pointerMovement: {
      type: 'sort',
      label: 'SORT ARRAY',
      direction: 'none',
      reason: 'Array sorted in ascending order. Duplicates are now clustered.',
    },
    foundTriplets: [],
    actionType: 'sort',
    actionTitle: '2. Array Sorted in Ascending Order',
    hinglishNarration: `Array sorted: [${elements.map((e) => e.val).join(', ')}]. Duplicate values ab adjacent hain!`,
    whyRule: 'Sorting se array me equal elements pass-pass aa jate hain jisse 2-pointer scanning aur O(1) duplicate skipping possible ho jata hai.',
  });

  // Loop i
  for (let i = 0; i < n - 2; i++) {
    const anchorVal = elements[i].val;

    // Duplicate Anchor Check
    if (i > 0 && elements[i].val === elements[i - 1].val) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 9,
        arraySnapshot: elements.map((e) => ({ ...e })),
        i,
        left: i + 1,
        right: n - 1,
        targetSum: 0,
        requiredPairSum: -anchorVal,
        currentPairSum: elements[i + 1].val + elements[n - 1].val,
        currentSum: anchorVal + elements[i + 1].val + elements[n - 1].val,
        sumStatus: 'NONE',
        pointerMovement: {
          type: 'duplicate_skip',
          label: `SKIP DUPLICATE ANCHOR (${anchorVal})`,
          direction: 'right',
          fromIdx: i - 1,
          toIdx: i,
          reason: `nums[${i}] === nums[${i - 1}] (${anchorVal}). Same anchor se duplicate triplets bante hain.`,
        },
        foundTriplets: foundTriplets.map((t) => [...t]),
        actionType: 'anchor_skip',
        actionTitle: `Skip Duplicate Anchor: nums[${i}] = ${anchorVal}`,
        hinglishNarration: `Index i=${i} (val ${anchorVal}) previous anchor (val ${elements[i - 1].val}) ke barabar hai. Skip!`,
        whyRule: 'Same anchor value ke saath 2Sum dubara chalane se exact duplicate triplets generate hote hain.',
      });
      continue;
    }

    // 1. Early termination: smallest 3 sum > 0 -> break
    const smallest3Sum = elements[i].val + elements[i + 1].val + elements[i + 2].val;
    if (smallest3Sum > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 11,
        arraySnapshot: elements.map((e) => ({ ...e })),
        i,
        left: i + 1,
        right: i + 2,
        targetSum: 0,
        requiredPairSum: -anchorVal,
        currentPairSum: elements[i + 1].val + elements[i + 2].val,
        currentSum: smallest3Sum,
        sumStatus: 'TOO_HIGH',
        pointerMovement: {
          type: 'early_exit',
          label: `SMALLEST 3-SUM (${smallest3Sum}) > 0 → BREAK`,
          direction: 'none',
          fromIdx: i,
          toIdx: i,
          reason: `nums[${i}] + nums[${i+1}] + nums[${i+2}] = ${smallest3Sum} > 0. Sorted array me aage koi bhi triplet 0 nahi de sakta!`,
        },
        foundTriplets: foundTriplets.map((t) => [...t]),
        actionType: 'early_stop',
        actionTitle: `Early Termination: Smallest 3-Sum = ${smallest3Sum} > 0`,
        hinglishNarration: `Anchor i=${i} par sabse chhote 3 elements ka sum hi ${smallest3Sum} > 0 hai. Search immediately terminate ho gayi!`,
        whyRule: 'Sorted array me aage sab bade numbers hain, isliye minimum sum > 0 hone par zero sum banna impossible hai.',
      });
      break;
    }

    // 2. Early skip: anchor + two largest elements < 0 -> continue
    const maxPossibleSum = elements[i].val + elements[n - 2].val + elements[n - 1].val;
    if (maxPossibleSum < 0) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 12,
        arraySnapshot: elements.map((e) => ({ ...e })),
        i,
        left: n - 2,
        right: n - 1,
        targetSum: 0,
        requiredPairSum: -anchorVal,
        currentPairSum: elements[n - 2].val + elements[n - 1].val,
        currentSum: maxPossibleSum,
        sumStatus: 'TOO_LOW',
        pointerMovement: {
          type: 'duplicate_skip',
          label: `LARGEST 2-SUM (${maxPossibleSum}) < 0 → SKIP ANCHOR`,
          direction: 'right',
          fromIdx: i,
          toIdx: i + 1,
          reason: `nums[${i}] + largest two (${elements[n-2].val} + ${elements[n-1].val}) = ${maxPossibleSum} < 0. Is anchor se 0 nahi ban sakta.`,
        },
        foundTriplets: foundTriplets.map((t) => [...t]),
        actionType: 'anchor_skip',
        actionTitle: `Early Skip: Max Possible Sum = ${maxPossibleSum} < 0`,
        hinglishNarration: `Anchor nums[${i}] ke saath do sabse bade elements (${elements[n-2].val}, ${elements[n-1].val}) ka sum bhi ${maxPossibleSum} < 0 hai. Skip to next anchor!`,
        whyRule: 'Agar max possible pair sum bhi negative hai, toh is anchor ke saath koi valid triplet exist nahi kar sakta.',
      });
      continue;
    }

    let left = i + 1;
    let right = n - 1;

    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 14,
      arraySnapshot: elements.map((e) => ({ ...e })),
      i,
      left,
      right,
      targetSum: 0,
      requiredPairSum: -anchorVal,
      currentPairSum: elements[left].val + elements[right].val,
      currentSum: anchorVal + elements[left].val + elements[right].val,
      sumStatus:
        anchorVal + elements[left].val + elements[right].val === 0
          ? 'MATCH'
          : anchorVal + elements[left].val + elements[right].val < 0
          ? 'TOO_LOW'
          : 'TOO_HIGH',
      pointerMovement: {
        type: 'i_advance',
        label: `ANCHOR i=${i} (val ${anchorVal}) FIXED`,
        direction: 'none',
        fromIdx: i,
        toIdx: i,
        reason: `Target 2Sum Pair needed: (nums[left] + nums[right]) = ${-anchorVal}`,
      },
      foundTriplets: foundTriplets.map((t) => [...t]),
      actionType: 'anchor_init',
      actionTitle: `Fix Anchor i=${i} (val ${anchorVal}) | Set left=${left}, right=${right}`,
      hinglishNarration: `Anchor nums[${i}] = ${anchorVal} set kiya. Two pointers left=${left} (val ${elements[left].val}) aur right=${right} (val ${elements[right].val}) set.`,
      whyRule: 'Har fixed anchor i ke liye remaining subarray [i+1...n-1] par 2Sum two-pointer search hoti hai.',
    });

    while (left < right) {
      const sum = elements[i].val + elements[left].val + elements[right].val;
      const pairSum = elements[left].val + elements[right].val;
      const neededPairSum = -elements[i].val;
      const status = sum === 0 ? 'MATCH' : sum < 0 ? 'TOO_LOW' : 'TOO_HIGH';

      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 18,
        arraySnapshot: elements.map((e) => ({ ...e })),
        i,
        left,
        right,
        targetSum: 0,
        requiredPairSum: neededPairSum,
        currentPairSum: pairSum,
        currentSum: sum,
        sumStatus: status,
        pointerMovement: {
          type: 'none',
          label: 'EVALUATING SUM',
          direction: 'none',
          reason: `Sum = (${elements[i].val}) + (${elements[left].val}) + (${elements[right].val}) = ${sum} vs Target 0`,
        },
        foundTriplets: foundTriplets.map((t) => [...t]),
        actionType: 'check_sum',
        actionTitle: `Evaluate Sum: (${elements[i].val}) + (${elements[left].val}) + (${elements[right].val}) = ${sum}`,
        hinglishNarration: `Pointers sum: nums[i](${elements[i].val}) + nums[left](${elements[left].val}) + nums[right](${elements[right].val}) = ${sum}. Target sum = 0.`,
        whyRule: 'Sum = 0 hone par valid triplet recorded. Sum < 0 par sum bada karna padega (left++). Sum > 0 par sum chhota karna padega (right--).',
      });

      if (sum === 0) {
        const triplet = [elements[i].val, elements[left].val, elements[right].val];
        foundTriplets.push(triplet);

        const oldLeft = left;
        const oldRight = right;

        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 25,
          arraySnapshot: elements.map((e) => ({ ...e })),
          i,
          left,
          right,
          targetSum: 0,
          requiredPairSum: neededPairSum,
          currentPairSum: pairSum,
          currentSum: 0,
          sumStatus: 'MATCH',
          pointerMovement: {
            type: 'both_contract',
            label: 'TRIPLET MATCH! BOTH POINTERS ADVANCE',
            direction: 'none',
            fromIdx: oldLeft,
            toIdx: oldLeft + 1,
            reason: `Target 0 reached! Move left (${oldLeft} → ${oldLeft + 1}) and right (${oldRight} → ${oldRight - 1})`,
          },
          foundTriplets: foundTriplets.map((t) => [...t]),
          newlyFoundTriplet: [...triplet],
          actionType: 'triplet_found',
          actionTitle: `🎉 UNIQUE TRIPLET FOUND: [${triplet.join(', ')}]`,
          hinglishNarration: `Valid Triplet found: [${triplet.join(', ')}]! Result set me add kar diya gaya.`,
          whyRule: 'Sum exact 0 hai! Is triplet ko output me recorded karke dono pointers left++ aur right-- kiye jayenge.',
        });

        // Skip duplicate left values (while nums[left] === nums[left+1])
        while (left < right && elements[left].val === elements[left + 1]?.val) {
          steps.push({
            stepNumber: steps.length + 1,
            activeLine: 26,
            arraySnapshot: elements.map((e) => ({ ...e })),
            i,
            left: left + 1,
            right,
            targetSum: 0,
            requiredPairSum: neededPairSum,
            currentPairSum: elements[left + 1]?.val + elements[right].val || 0,
            currentSum: elements[i].val + (elements[left + 1]?.val || 0) + elements[right].val,
            sumStatus: 'NONE',
            pointerMovement: {
              type: 'duplicate_skip',
              label: `SKIP DUPLICATE LEFT (val ${elements[left].val})`,
              direction: 'right',
              fromIdx: left,
              toIdx: left + 1,
              reason: `nums[left] == nums[left+1] (${elements[left].val}). Skip duplicate to prevent identical triplets.`,
            },
            foundTriplets: foundTriplets.map((t) => [...t]),
            actionType: 'advance_left',
            actionTitle: `Skip Duplicate left: nums[${left}] = ${elements[left].val}`,
            hinglishNarration: `Left pointer index ${left} next element (${elements[left + 1]?.val}) ke barabar hai, isliye duplicate skip kiya.`,
            whyRule: 'Left pointer ke duplicate values ko skip karna unique triplets guarantee karta hai.',
          });
          left++;
        }

        // Skip duplicate right values (while nums[right] === nums[right-1])
        while (left < right && elements[right].val === elements[right - 1]?.val) {
          steps.push({
            stepNumber: steps.length + 1,
            activeLine: 27,
            arraySnapshot: elements.map((e) => ({ ...e })),
            i,
            left,
            right: right - 1,
            targetSum: 0,
            requiredPairSum: neededPairSum,
            currentPairSum: elements[left].val + (elements[right - 1]?.val || 0),
            currentSum: elements[i].val + elements[left].val + (elements[right - 1]?.val || 0),
            sumStatus: 'NONE',
            pointerMovement: {
              type: 'duplicate_skip',
              label: `SKIP DUPLICATE RIGHT (val ${elements[right].val})`,
              direction: 'left',
              fromIdx: right,
              toIdx: right - 1,
              reason: `nums[right] == nums[right-1] (${elements[right].val}). Skip duplicate to prevent identical triplets.`,
            },
            foundTriplets: foundTriplets.map((t) => [...t]),
            actionType: 'shrink_right',
            actionTitle: `Skip Duplicate right: nums[${right}] = ${elements[right].val}`,
            hinglishNarration: `Right pointer index ${right} previous element (${elements[right - 1]?.val}) ke barabar hai, isliye duplicate skip kiya.`,
            whyRule: 'Right pointer ke duplicate values ko skip karna unique triplets guarantee karta hai.',
          });
          right--;
        }

        left++;
        right--;
      } else if (sum < 0) {
        const oldLeft = left;
        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 21,
          arraySnapshot: elements.map((e) => ({ ...e })),
          i,
          left: left + 1,
          right,
          targetSum: 0,
          requiredPairSum: neededPairSum,
          currentPairSum: elements[left + 1] ? elements[left + 1].val + elements[right].val : pairSum,
          currentSum: sum,
          sumStatus: 'TOO_LOW',
          pointerMovement: {
            type: 'left_advance',
            label: `LEFT POINTER MOVED RIGHT ➡️ (${oldLeft} → ${oldLeft + 1})`,
            direction: 'right',
            fromIdx: oldLeft,
            toIdx: oldLeft + 1,
            reason: `Sum (${sum}) < Target (0) → Must increase sum → Move left++`,
          },
          foundTriplets: foundTriplets.map((t) => [...t]),
          actionType: 'advance_left',
          actionTitle: `Sum (${sum}) < 0 → Move left++ (${oldLeft} → ${oldLeft + 1})`,
          hinglishNarration: `Current sum ${sum} 0 se chhota hai. Sum ko bada karne ke liye left pointer ko aage badhaya (left++).`,
          whyRule: 'Sorted array me larger elements right direction me milte hain, isliye left++ sum ko increase karta hai.',
        });
        left++;
      } else {
        const oldRight = right;
        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 23,
          arraySnapshot: elements.map((e) => ({ ...e })),
          i,
          left,
          right: right - 1,
          targetSum: 0,
          requiredPairSum: neededPairSum,
          currentPairSum: elements[right - 1] ? elements[left].val + elements[right - 1].val : pairSum,
          currentSum: sum,
          sumStatus: 'TOO_HIGH',
          pointerMovement: {
            type: 'right_shrink',
            label: `RIGHT POINTER MOVED LEFT ⬅️ (${oldRight} → ${oldRight - 1})`,
            direction: 'left',
            fromIdx: oldRight,
            toIdx: oldRight - 1,
            reason: `Sum (${sum}) > Target (0) → Must decrease sum → Move right--`,
          },
          foundTriplets: foundTriplets.map((t) => [...t]),
          actionType: 'shrink_right',
          actionTitle: `Sum (${sum}) > 0 → Move right-- (${oldRight} → ${oldRight - 1})`,
          hinglishNarration: `Current sum ${sum} 0 se bada hai. Sum ko kam karne ke liye right pointer ko peeche laya (right--).`,
          whyRule: 'Sorted array me smaller elements left direction me milte hain, isliye right-- sum ko decrease karta hai.',
        });
        right--;
      }
    }
  }

  // Completion step
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 34,
    arraySnapshot: elements.map((e) => ({ ...e })),
    i: n - 1,
    left: n - 1,
    right: n - 1,
    targetSum: 0,
    requiredPairSum: 0,
    currentPairSum: 0,
    currentSum: 0,
    sumStatus: 'NONE',
    pointerMovement: {
      type: 'none',
      label: 'FINISHED',
      direction: 'none',
      reason: 'All potential anchor points evaluated. Finished.',
    },
    foundTriplets: foundTriplets.map((t) => [...t]),
    actionType: 'complete',
    actionTitle: 'Scan Completed! 3Sum Execution Finished.',
    hinglishNarration: `Execution complete! Total unique triplets found: ${foundTriplets.length} ${JSON.stringify(foundTriplets)}.`,
    whyRule: 'O(N^2) 2-pointer scan finish ho gaya hai. All valid unique triplets return kar diye gaye hain.',
  });

  return steps;
}
