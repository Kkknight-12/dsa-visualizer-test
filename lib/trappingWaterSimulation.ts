import { ArrayBlockElement } from '@/components/common/ReorderableArrayRail';

export interface TrappingWaterStep {
  stepNumber: number;
  activeLine: number;
  heights: number[];
  arraySnapshot: ArrayBlockElement[];
  left: number;
  right: number;
  leftMax: number;
  rightMax: number;
  totalWater: number;
  waterGrid: number[]; // Water units currently trapped at each index
  activePointer?: 'left' | 'right';
  trappingAtIdx?: number;
  newTrappedUnits?: number;
  actionType:
    | 'init'
    | 'compare_pointers'
    | 'update_left_max'
    | 'trap_left'
    | 'update_right_max'
    | 'trap_right'
    | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface TrappingWaterPreset {
  id: string;
  name: string;
  heights: number[];
}

export const TRAPPING_WATER_PRESETS: TrappingWaterPreset[] = [
  {
    id: 'preset-standard',
    name: 'Standard LeetCode [0,1,0,2,1,0,1,3,2,1,2,1]',
    heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
  },
  {
    id: 'preset-basin',
    name: 'Deep Basin [4, 2, 0, 3, 2, 5]',
    heights: [4, 2, 0, 3, 2, 5],
  },
  {
    id: 'preset-u-shape',
    name: 'U-Shape Reservoir [5, 1, 0, 1, 5]',
    heights: [5, 1, 0, 1, 5],
  },
];

export function generateTrappingWaterSteps(heights: number[]): TrappingWaterStep[] {
  const steps: TrappingWaterStep[] = [];
  const n = heights.length;

  const arraySnapshot: ArrayBlockElement[] = heights.map((val, idx) => ({
    id: `bar-${idx}-${val}`,
    val,
  }));

  const waterGrid: number[] = new Array(n).fill(0);
  let left = 0;
  let right = n - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  // Step 1: Init
  steps.push({
    stepNumber: 1,
    activeLine: 4,
    heights: [...heights],
    arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
    left,
    right,
    leftMax,
    rightMax,
    totalWater,
    waterGrid: [...waterGrid],
    actionType: 'init',
    actionTitle: `Initialize Two Pointers: left=0, right=${right}`,
    hinglishNarration: `Pointers initialize ho gaye. left=0, right=${right}, leftMax=0, rightMax=0, totalWater=0.`,
    whyRule: 'Two pointers dono ends se center ki taraf inward converge karenge.',
  });

  while (left <= right) {
    // Step: Compare pointers
    const isLeftShorterOrEqual = heights[left] <= heights[right];

    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 9,
      heights: [...heights],
      arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
      left,
      right,
      leftMax,
      rightMax,
      totalWater,
      waterGrid: [...waterGrid],
      activePointer: isLeftShorterOrEqual ? 'left' : 'right',
      actionType: 'compare_pointers',
      actionTitle: `Compare heights: height[left=${left}] (${heights[left]}) ${
        isLeftShorterOrEqual ? '<=' : '>'
      } height[right=${right}] (${heights[right]})`,
      hinglishNarration: isLeftShorterOrEqual
        ? `height[left=${left}]=${heights[left]} <= height[right=${right}]=${heights[right]}. Right side mein already unchi wall hai, toh bottleneck LEFT side par hai.`
        : `height[left=${left}]=${heights[left]} > height[right=${right}]=${heights[right]}. Left side mein already unchi wall hai, toh bottleneck RIGHT side par hai.`,
      whyRule: 'Paani ka trapping level hamesha shorter wall se bounded hota hai.',
    });

    if (isLeftShorterOrEqual) {
      if (heights[left] >= leftMax) {
        leftMax = heights[left];

        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 12,
          heights: [...heights],
          arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
          left,
          right,
          leftMax,
          rightMax,
          totalWater,
          waterGrid: [...waterGrid],
          activePointer: 'left',
          actionType: 'update_left_max',
          actionTitle: `New Left Peak Found: leftMax = ${leftMax} at index [${left}]`,
          hinglishNarration: `Index [${left}] par nayi maximum wall mil gayi (leftMax = ${leftMax}). Is peak ke upar paani nahi ruk sakta.`,
          whyRule: 'Current bar leftMax se uncha ya barabar hai, isliye 0 units trap hoga.',
        });
      } else {
        const trapped = leftMax - heights[left];
        waterGrid[left] = trapped;
        totalWater += trapped;

        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 16,
          heights: [...heights],
          arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
          left,
          right,
          leftMax,
          rightMax,
          totalWater,
          waterGrid: [...waterGrid],
          activePointer: 'left',
          trappingAtIdx: left,
          newTrappedUnits: trapped,
          actionType: 'trap_left',
          actionTitle: `🌊 Trap Water at [${left}]: leftMax (${leftMax}) - height (${heights[left]}) = +${trapped} units`,
          hinglishNarration: `Index [${left}] par ${trapped} unit paani trap hua! Total Water ab ${totalWater} ho gaya.`,
          whyRule: 'Water trapped = leftMax - height[left], kyunki right side safe boundary provide kar raha hai.',
        });
      }
      left++;
    } else {
      if (heights[right] >= rightMax) {
        rightMax = heights[right];

        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 21,
          heights: [...heights],
          arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
          left,
          right,
          leftMax,
          rightMax,
          totalWater,
          waterGrid: [...waterGrid],
          activePointer: 'right',
          actionType: 'update_right_max',
          actionTitle: `New Right Peak Found: rightMax = ${rightMax} at index [${right}]`,
          hinglishNarration: `Index [${right}] par nayi maximum wall mil gayi (rightMax = ${rightMax}). Is peak ke upar paani nahi ruk sakta.`,
          whyRule: 'Current bar rightMax se uncha ya barabar hai, isliye 0 units trap hoga.',
        });
      } else {
        const trapped = rightMax - heights[right];
        waterGrid[right] = trapped;
        totalWater += trapped;

        steps.push({
          stepNumber: steps.length + 1,
          activeLine: 25,
          heights: [...heights],
          arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
          left,
          right,
          leftMax,
          rightMax,
          totalWater,
          waterGrid: [...waterGrid],
          activePointer: 'right',
          trappingAtIdx: right,
          newTrappedUnits: trapped,
          actionType: 'trap_right',
          actionTitle: `🌊 Trap Water at [${right}]: rightMax (${rightMax}) - height (${heights[right]}) = +${trapped} units`,
          hinglishNarration: `Index [${right}] par ${trapped} unit paani trap hua! Total Water ab ${totalWater} ho gaya.`,
          whyRule: 'Water trapped = rightMax - height[right], kyunki left side safe boundary provide kar raha hai.',
        });
      }
      right--;
    }
  }

  // Final Completion Step
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 31,
    heights: [...heights],
    arraySnapshot: arraySnapshot.map((e) => ({ ...e })),
    left,
    right,
    leftMax,
    rightMax,
    totalWater,
    waterGrid: [...waterGrid],
    actionType: 'complete',
    actionTitle: `🎉 Trapping Complete: Total Water Trapped = ${totalWater} Units!`,
    hinglishNarration: `Algorithm finish ho gaya! Pointers cross kar gaye. Total Trapped Water = ${totalWater} units.`,
    whyRule: 'Both pointers have fully processed all terrain bars in O(N) single pass.',
  });

  return steps;
}
