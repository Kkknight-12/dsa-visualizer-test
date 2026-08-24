export interface SortColorsStep {
  stepNumber: number;
  activeLine: number;
  arraySnapshot: number[];
  low: number;
  mid: number;
  high: number;
  swappingIndices?: [number, number];
  actionType: 'init' | 'check' | 'swap_low' | 'advance_mid' | 'swap_high' | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface SortColorsPreset {
  id: string;
  name: string;
  initialArray: number[];
}

export const SORT_COLORS_PRESETS: SortColorsPreset[] = [
  {
    id: 'preset-standard',
    name: 'Standard Mixed [2, 0, 2, 1, 1, 0]',
    initialArray: [2, 0, 2, 1, 1, 0],
  },
  {
    id: 'preset-reverse',
    name: 'Reverse Sorted [2, 2, 1, 1, 0, 0]',
    initialArray: [2, 2, 1, 1, 0, 0],
  },
  {
    id: 'preset-large',
    name: 'Large Array [2, 0, 1, 2, 1, 0, 0, 2, 1]',
    initialArray: [2, 0, 1, 2, 1, 0, 0, 2, 1],
  },
];

export function generateSortColorsSteps(initialArray: number[]): SortColorsStep[] {
  const steps: SortColorsStep[] = [];
  const nums = [...initialArray];
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  // Step 1: Initialization
  steps.push({
    stepNumber: 1,
    activeLine: 4,
    arraySnapshot: [...nums],
    low,
    mid,
    high,
    actionType: 'init',
    actionTitle: 'Initialize Pointers: low=0, mid=0, high=' + high,
    hinglishNarration: `Dutch National Flag algorithm initialize ho gaya hai. low=0, mid=0, high=${high}.`,
    whyRule: 'low 0s region ki boundary ko track karta hai, mid current element scan karta hai, aur high 2s region ki left boundary hai.',
  });

  while (mid <= high) {
    const val = nums[mid];

    // Check step
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 7,
      arraySnapshot: [...nums],
      low,
      mid,
      high,
      actionType: 'check',
      actionTitle: `Examine nums[mid=${mid}] = ${val}`,
      hinglishNarration: `Index mid=${mid} par value ${val} hai. Iske value ke basis par next move decide karenge.`,
      whyRule: 'mid pointer unknown element ko inspect karta hai.',
    });

    if (val === 0) {
      // Swap nums[low] and nums[mid]
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 10,
        arraySnapshot: [...nums],
        low,
        mid,
        high,
        swappingIndices: [low, mid],
        actionType: 'swap_low',
        actionTitle: `Swap nums[low=${low}] (${nums[low]}) & nums[mid=${mid}] (${val}) -> low++, mid++`,
        hinglishNarration: `Value 0 mil gayi! Swap(nums[${low}], nums[${mid}]). low aur mid dono 1 step aage badhein.`,
        whyRule: '0 ko Red 0s section [0 ... low-1] mein jaana hai.',
      });

      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (val === 1) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 14,
        arraySnapshot: [...nums],
        low,
        mid,
        high,
        actionType: 'advance_mid',
        actionTitle: `nums[mid=${mid}] == 1 -> Just mid++`,
        hinglishNarration: `Value 1 mil gayi! Yeh White 1s region [low ... mid-1] mein already sahi jagah hai. Simply mid++ karte hain.`,
        whyRule: '1s ko beech ke section mein rehna hai, isliye koi swap zaruri nahi hai.',
      });

      mid++;
    } else {
      // val === 2
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 18,
        arraySnapshot: [...nums],
        low,
        mid,
        high,
        swappingIndices: [mid, high],
        actionType: 'swap_high',
        actionTitle: `Swap nums[mid=${mid}] (${val}) & nums[high=${high}] (${nums[high]}) -> high--`,
        hinglishNarration: `Value 2 mil gayi! Swap(nums[${mid}], nums[${high}]). high pointer 1 step peeche aaya. Note: mid increment nahi hoga kyunki swapped element abhi inspect hona baki hai!`,
        whyRule: '2 ko Blue 2s section [high+1 ... n-1] mein bhejna hai.',
      });

      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }

  // Final Completion Step
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 24,
    arraySnapshot: [...nums],
    low,
    mid,
    high,
    actionType: 'complete',
    actionTitle: '🎉 Sorting Complete: Array Fully Partitioned!',
    hinglishNarration: `Dutch National Flag algorithm complete! All 0s, 1s, and 2s are in-place sorted: [${nums.join(', ')}].`,
    whyRule: 'mid > high condition satisfy ho gayi, iska matlab saare elements correct regions mein divide ho chuke hain.',
  });

  return steps;
}
