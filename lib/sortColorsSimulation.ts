export interface ArrayElement {
  id: string; // Unique persistent ID (e.g. 'el-0', 'el-1') for Framer Motion physical layout animation
  val: number; // 0, 1, or 2
}

export interface SortColorsStep {
  stepNumber: number;
  activeLine: number;
  arraySnapshot: ArrayElement[];
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
  
  // Assign unique persistent IDs to each initial element
  const elements: ArrayElement[] = initialArray.map((val, idx) => ({
    id: `el-${idx}-${val}`,
    val,
  }));

  let low = 0;
  let mid = 0;
  let high = elements.length - 1;

  // Step 1: Initialization
  steps.push({
    stepNumber: 1,
    activeLine: 4,
    arraySnapshot: elements.map((e) => ({ ...e })),
    low,
    mid,
    high,
    actionType: 'init',
    actionTitle: `Initialize Pointers: low=0, mid=0, high=${high}`,
    hinglishNarration: `Dutch National Flag algorithm initialize ho gaya hai. low=0, mid=0, high=${high}.`,
    whyRule: 'low 0s region ki boundary ko track karta hai, mid current element scan karta hai, aur high 2s region ki left boundary hai.',
  });

  while (mid <= high) {
    const val = elements[mid].val;

    // Check step
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 7,
      arraySnapshot: elements.map((e) => ({ ...e })),
      low,
      mid,
      high,
      actionType: 'check',
      actionTitle: `Examine nums[mid=${mid}] = ${val}`,
      hinglishNarration: `Index mid=${mid} par value ${val} hai. Iske value ke basis par next move decide karenge.`,
      whyRule: 'mid pointer unknown element ko inspect karta hai.',
    });

    if (val === 0) {
      // Swap elements[low] and elements[mid]
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 10,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        swappingIndices: [low, mid],
        actionType: 'swap_low',
        actionTitle: `Physical Arc Swap: nums[low=${low}] (${elements[low].val}) ↔ nums[mid=${mid}] (${val})`,
        hinglishNarration: `Value 0 mil gayi! Elements physically swap ho rahe hain [low=${low}] ↔ [mid=${mid}]. low aur mid 1 step aage badhein.`,
        whyRule: '0 ko Red 0s section [0 ... low-1] mein jaana hai.',
      });

      // Perform swap in persistent element array
      [elements[low], elements[mid]] = [elements[mid], elements[low]];
      low++;
      mid++;
    } else if (val === 1) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 14,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        actionType: 'advance_mid',
        actionTitle: `nums[mid=${mid}] == 1 -> Just mid++`,
        hinglishNarration: `Value 1 mil gayi! White 1s region mein already correct hai. Simply mid++ karte hain.`,
        whyRule: '1s ko beech ke section mein rehna hai, isliye koi swap zaruri nahi hai.',
      });

      mid++;
    } else {
      // val === 2
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 18,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        swappingIndices: [mid, high],
        actionType: 'swap_high',
        actionTitle: `Physical Arc Swap: nums[mid=${mid}] (${val}) ↔ nums[high=${high}] (${elements[high].val})`,
        hinglishNarration: `Value 2 mil gayi! Elements physically swap ho rahe hain [mid=${mid}] ↔ [high=${high}]. high 1 step peeche aaya.`,
        whyRule: '2 ko Blue 2s section [high+1 ... n-1] mein bhejna hai.',
      });

      // Perform swap in persistent element array
      [elements[mid], elements[high]] = [elements[high], elements[mid]];
      high--;
    }
  }

  // Final Completion Step
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 24,
    arraySnapshot: elements.map((e) => ({ ...e })),
    low,
    mid,
    high,
    actionType: 'complete',
    actionTitle: '🎉 Sorting Complete: Array Fully Partitioned!',
    hinglishNarration: `Dutch National Flag algorithm complete! All elements in-place sorted: [${elements.map((e) => e.val).join(', ')}].`,
    whyRule: 'mid > high condition satisfy ho gayi, iska matlab saare elements correct regions mein divide ho chuke hain.',
  });

  return steps;
}
