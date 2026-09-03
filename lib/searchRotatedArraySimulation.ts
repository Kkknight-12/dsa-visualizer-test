export interface SearchRotatedArrayStep {
  stepNumber: number;
  array: number[];
  target: number;
  low: number;
  high: number;
  mid: number;
  sortedHalf: 'left' | 'right' | null;
  eliminatedRange: [number, number] | null;
  activeRange: [number, number];
  isMatch: boolean;
  isNotFound: boolean;
  highlightedLine: number;
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface PresetScenario {
  id: string;
  name: string;
  array: number[];
  target: number;
  description: string;
}

export const SEARCH_ROTATED_ARRAY_PRESETS: PresetScenario[] = [
  {
    id: 'preset-standard-target-right',
    name: 'Standard LeetCode [4,5,6,7,0,1,2] (target=0)',
    array: [4, 5, 6, 7, 0, 1, 2],
    target: 0,
    description: 'Target 0 right unrotated partition mein present hai.',
  },
  {
    id: 'preset-standard-target-left',
    name: 'Standard LeetCode [4,5,6,7,0,1,2] (target=5)',
    array: [4, 5, 6, 7, 0, 1, 2],
    target: 5,
    description: 'Target 5 left sorted partition mein present hai.',
  },
  {
    id: 'preset-target-not-found',
    name: 'Target Absent [4,5,6,7,0,1,2] (target=3)',
    array: [4, 5, 6, 7, 0, 1, 2],
    target: 3,
    description: 'Target 3 array mein present nahi hai (-1 return hoga).',
  },
  {
    id: 'preset-small-rotated',
    name: 'Small Array [5,1,3] (target=5)',
    array: [5, 1, 3],
    target: 5,
    description: 'Short array jahan pivot index 1 par hai aur target first element hai.',
  },
  {
    id: 'preset-large-rotated',
    name: 'Wide Basin [6,7,8,1,2,3,4,5] (target=1)',
    array: [6, 7, 8, 1, 2, 3, 4, 5],
    target: 1,
    description: 'Pivot minimum element par search target located hai.',
  },
];

export function generateSearchRotatedArraySteps(
  nums: number[],
  target: number
): SearchRotatedArrayStep[] {
  const steps: SearchRotatedArrayStep[] = [];
  let stepCount = 1;

  let low = 0;
  let high = nums.length - 1;

  // Step 1: Initial State
  steps.push({
    stepNumber: stepCount++,
    array: [...nums],
    target,
    low,
    high,
    mid: Math.floor((low + high) / 2),
    sortedHalf: null,
    eliminatedRange: null,
    activeRange: [low, high],
    isMatch: false,
    isNotFound: false,
    highlightedLine: 2, // let low = 0, high = nums.length - 1;
    actionTitle: `Pointers Initialized: low=0, high=${high}`,
    hinglishNarration: `Search shuru hoti hai pure array [0 ... ${high}] par. Target = ${target}.`,
    whyRule: `Binary Search start karne ke liye search space boundaries set ki gayi hain.`,
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);

    // Calculate mid step
    steps.push({
      stepNumber: stepCount++,
      array: [...nums],
      target,
      low,
      high,
      mid,
      sortedHalf: null,
      eliminatedRange: null,
      activeRange: [low, high],
      isMatch: nums[mid] === target,
      isNotFound: false,
      highlightedLine: 5, // const mid = Math.floor(low + (high - low) / 2);
      actionTitle: `Inspect mid=${mid} (Value = ${nums[mid]})`,
      hinglishNarration: `Calculated mid = ${mid}. nums[mid] ki value ${nums[mid]} hai. Target = ${target}.`,
      whyRule: `Mid point se array do halves mein divide hota hai: Left [${low} ... ${mid}] aur Right [${mid} ... ${high}].`,
    });

    // Check Match
    if (nums[mid] === target) {
      steps.push({
        stepNumber: stepCount++,
        array: [...nums],
        target,
        low,
        high,
        mid,
        sortedHalf: null,
        eliminatedRange: null,
        activeRange: [mid, mid],
        isMatch: true,
        isNotFound: false,
        highlightedLine: 8, // return mid;
        actionTitle: `🎯 TARGET FOUND at Index ${mid}!`,
        hinglishNarration: `nums[${mid}] === ${target}! Target mil gaya hai, index ${mid} return karenge.`,
        whyRule: `Exact target match ho gaya! Ab aage search karne ki zaroorat nahi.`,
      });
      return steps;
    }

    // Check Left Half Sorted
    if (nums[low] <= nums[mid]) {
      const isLeftSorted = true;

      steps.push({
        stepNumber: stepCount++,
        array: [...nums],
        target,
        low,
        high,
        mid,
        sortedHalf: 'left',
        eliminatedRange: null,
        activeRange: [low, high],
        isMatch: false,
        isNotFound: false,
        highlightedLine: 11, // if (nums[low] <= nums[mid])
        actionTitle: `Left Half [${low} ... ${mid}] is SORTED (${nums[low]} <= ${nums[mid]})`,
        hinglishNarration: `nums[low]=${nums[low]} <= nums[mid]=${nums[mid]}. Iska matlab left half [${low} ... ${mid}] strictly sorted hai!`,
        whyRule: `Jab start element mid se chhota ya barabar ho, toh rotation pivot is range ke bahar hota hai, isliye ye half sorted hai.`,
      });

      // Does target lie inside left half?
      if (target >= nums[low] && target < nums[mid]) {
        const oldHigh = high;
        const elimRange: [number, number] = [mid, oldHigh];
        high = mid - 1;

        steps.push({
          stepNumber: stepCount++,
          array: [...nums],
          target,
          low,
          high,
          mid,
          sortedHalf: 'left',
          eliminatedRange: elimRange,
          activeRange: [low, high],
          isMatch: false,
          isNotFound: false,
          highlightedLine: 14, // high = mid - 1;
          actionTitle: `Target ${target} is inside Left Sorted Half -> Eliminate Right Half [${elimRange[0]} ... ${elimRange[1]}]`,
          hinglishNarration: `Target (${target}) sorted left range [${nums[low]} ... ${nums[mid]}] ke andar hai! Right half ko discard kiya aur high = ${high} banaya.`,
          whyRule: `Kyunki left half strictly sorted hai aur target uske bounds mein hai, target right half mein kabhi nahi ho sakta.`,
        });
      } else {
        const oldLow = low;
        const elimRange: [number, number] = [oldLow, mid];
        low = mid + 1;

        steps.push({
          stepNumber: stepCount++,
          array: [...nums],
          target,
          low,
          high,
          mid,
          sortedHalf: 'left',
          eliminatedRange: elimRange,
          activeRange: [low, high],
          isMatch: false,
          isNotFound: false,
          highlightedLine: 17, // low = mid + 1;
          actionTitle: `Target ${target} is NOT inside Left Sorted Half -> Eliminate Left Half [${elimRange[0]} ... ${elimRange[1]}]`,
          hinglishNarration: `Left half sorted hai par target (${target}) is range [${nums[oldLow]} ... ${nums[mid]}] ke bahar hai. Left half discard kar diya! low = ${low}.`,
          whyRule: `Agar ek sorted half ke bounds mein target nahi hai, toh wo sirf bache hue unsorted half mein hi exist kar sakta hai.`,
        });
      }
    } else {
      // Right Half MUST be sorted
      steps.push({
        stepNumber: stepCount++,
        array: [...nums],
        target,
        low,
        high,
        mid,
        sortedHalf: 'right',
        eliminatedRange: null,
        activeRange: [low, high],
        isMatch: false,
        isNotFound: false,
        highlightedLine: 21, // else (right half is sorted)
        actionTitle: `Right Half [${mid} ... ${high}] is SORTED (${nums[mid]} <= ${nums[high]})`,
        hinglishNarration: `Left half sorted nahi tha, iska matlab Right Half [${mid} ... ${high}] 100% sorted hai (${nums[mid]} <= ${nums[high]})!`,
        whyRule: `Rotated array ki invariant guarantee hai: dono halves mein se at least ek hamesha sorted rehta hai.`,
      });

      // Does target lie inside right half?
      if (target > nums[mid] && target <= nums[high]) {
        const oldLow = low;
        const elimRange: [number, number] = [oldLow, mid];
        low = mid + 1;

        steps.push({
          stepNumber: stepCount++,
          array: [...nums],
          target,
          low,
          high,
          mid,
          sortedHalf: 'right',
          eliminatedRange: elimRange,
          activeRange: [low, high],
          isMatch: false,
          isNotFound: false,
          highlightedLine: 24, // low = mid + 1;
          actionTitle: `Target ${target} is inside Right Sorted Half -> Eliminate Left Half [${elimRange[0]} ... ${elimRange[1]}]`,
          hinglishNarration: `Target (${target}) sorted right range [${nums[mid]} ... ${nums[high]}] ke andar hai! Left half discard kiya, low = ${low}.`,
          whyRule: `Right half strictly sorted hai aur target uske bounds mein hai, isliye search right half tak restrict ho gayi.`,
        });
      } else {
        const oldHigh = high;
        const elimRange: [number, number] = [mid, oldHigh];
        high = mid - 1;

        steps.push({
          stepNumber: stepCount++,
          array: [...nums],
          target,
          low,
          high,
          mid,
          sortedHalf: 'right',
          eliminatedRange: elimRange,
          activeRange: [low, high],
          isMatch: false,
          isNotFound: false,
          highlightedLine: 27, // high = mid - 1;
          actionTitle: `Target ${target} is NOT inside Right Sorted Half -> Eliminate Right Half [${elimRange[0]} ... ${elimRange[1]}]`,
          hinglishNarration: `Right half sorted hai par target (${target}) is range ke bahar hai. Right half discard kar diya! high = ${high}.`,
          whyRule: `Agar target sorted right half mein nahi hai, toh wo sirf bache hue left half mein hi mil sakta hai.`,
        });
      }
    }
  }

  // Not Found Step
  steps.push({
    stepNumber: stepCount++,
    array: [...nums],
    target,
    low,
    high,
    mid: -1,
    sortedHalf: null,
    eliminatedRange: null,
    activeRange: [0, 0],
    isMatch: false,
    isNotFound: true,
    highlightedLine: 32, // return -1;
    actionTitle: `❌ TARGET ${target} NOT FOUND IN ARRAY`,
    hinglishNarration: `low > high ho gaya! Search space empty ho chuka hai aur target nahi mila. Return -1.`,
    whyRule: `Binary search space exhaust ho gayi. Agar target hota toh kisi na kisi step par match ho chuka hota.`,
  });

  return steps;
}
