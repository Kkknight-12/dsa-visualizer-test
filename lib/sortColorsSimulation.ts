export interface ArrayElement {
  id: string; // Unique persistent ID for Framer Motion physical layout animation
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
  actionType: 'init' | 'check' | 'swap_low' | 'advance_low_mid' | 'advance_mid' | 'swap_high' | 'shrink_high' | 'complete';
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
      // Perform physical swap in elements array first
      [elements[low], elements[mid]] = [elements[mid], elements[low]];

      // PHASE 1: Physical Block Swap (Pointers LOW and MID stay 100% frozen/stable!)
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 9,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        swappingIndices: [low, mid],
        actionType: 'swap_low',
        actionTitle: `Phase 1: Physical Block Swap nums[low=${low}] ↔ nums[mid=${mid}]`,
        hinglishNarration: `Blocks physically swap ho rahe hain. Pointers low=${low} aur mid=${mid} stationary/stable hain.`,
        whyRule: '0 ko Red 0s section [0 ... low-1] mein jaana hai.',
      });

      // Increment pointers for Phase 2
      low++;
      mid++;

      // PHASE 2: Pointer Advance (Blocks are settled, pointers move now!)
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 10,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        actionType: 'advance_low_mid',
        actionTitle: `Phase 2: Advance Pointers -> low++ (${low - 1} → ${low}), mid++ (${mid - 1} → ${mid})`,
        hinglishNarration: `Block swap complete hone ke baad ab low aur mid pointers 1 step aage badhein.`,
        whyRule: 'Red 0s section boundary expand ho gayi.',
      });

    } else if (val === 1) {
      mid++;

      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 14,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        actionType: 'advance_mid',
        actionTitle: `nums[mid] == 1 -> Advance mid++ (${mid - 1} → ${mid})`,
        hinglishNarration: `Value 1 mil gayi! White 1s region mein already correct hai. Simply mid++ karte hain.`,
        whyRule: '1s ko beech ke section mein rehna hai, isliye koi swap zaruri nahi hai.',
      });

    } else {
      // val === 2
      // Perform physical swap in elements array first
      [elements[mid], elements[high]] = [elements[high], elements[mid]];

      // PHASE 1: Physical Block Swap (Pointers HIGH and MID stay 100% frozen/stable!)
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 17,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        swappingIndices: [mid, high],
        actionType: 'swap_high',
        actionTitle: `Phase 1: Physical Block Swap nums[mid=${mid}] ↔ nums[high=${high}]`,
        hinglishNarration: `Blocks physically swap ho rahe hain. Pointer high=${high} stationary/stable hai.`,
        whyRule: '2 ko Blue 2s section [high+1 ... n-1] mein bhejna hai.',
      });

      // Shrink high pointer for Phase 2
      high--;

      // PHASE 2: Pointer Shrink (Blocks are settled, high pointer shrinks now!)
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 18,
        arraySnapshot: elements.map((e) => ({ ...e })),
        low,
        mid,
        high,
        actionType: 'shrink_high',
        actionTitle: `Phase 2: Shrink Pointer -> high-- (${high + 1} → ${high})`,
        hinglishNarration: `Block swap complete hone ke baad high pointer 1 step left aaya.`,
        whyRule: 'Blue 2s section boundary left mein shift ho gayi.',
      });
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
