import { ArrayBlockElement } from '@/components/common/ReorderableArrayRail';

export interface KadanesStep {
  stepNumber: number;
  activeLine: number;
  arraySnapshot: ArrayBlockElement[];
  currentIndex: number;
  currentSum: number;
  maxSum: number;
  tempStart: number;
  bestStart: number;
  bestEnd: number;
  actionType: 'init' | 'inspect' | 'add_sum' | 'update_max' | 'reset_sum' | 'complete';
  actionTitle: string;
  hinglishNarration: string;
  whyRule: string;
}

export interface KadanesPreset {
  id: string;
  name: string;
  initialArray: number[];
}

export const KADANES_PRESETS: KadanesPreset[] = [
  {
    id: 'preset-standard',
    name: 'Mixed [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    initialArray: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  },
  {
    id: 'preset-all-negative',
    name: 'All Negative [-5, -2, -8, -1, -4]',
    initialArray: [-5, -2, -8, -1, -4],
  },
  {
    id: 'preset-all-positive',
    name: 'All Positive [5, 4, -1, 7, 8]',
    initialArray: [5, 4, -1, 7, 8],
  },
];

export function generateKadanesSteps(initialArray: number[]): KadanesStep[] {
  const steps: KadanesStep[] = [];
  const elements: ArrayBlockElement[] = initialArray.map((val, idx) => ({
    id: `el-${idx}-${val}`,
    val,
  }));

  let maxSum = -Infinity;
  let sum = 0;
  let bestStart = 0;
  let bestEnd = 0;
  let tempStart = 0;

  // Step 1: Initialization
  steps.push({
    stepNumber: 1,
    activeLine: 4,
    arraySnapshot: elements.map((e) => ({ ...e })),
    currentIndex: 0,
    currentSum: 0,
    maxSum: -Infinity,
    tempStart: 0,
    bestStart: 0,
    bestEnd: 0,
    actionType: 'init',
    actionTitle: 'Initialize Kadane Tracker: sum=0, maxSum=-Infinity',
    hinglishNarration: `Kadane's Algorithm initialize ho gaya. sum=0 aur maxSum=-Infinity set hai.`,
    whyRule: "maxSum = -Infinity set karte hain taaki agar saare numbers negative ho toh bhi max value correct choose ho. sum = 0 se running tracker start hota hai.",
  });

  for (let i = 0; i < elements.length; i++) {
    const val = elements[i].val;

    // Check if sum was 0, reset candidate start
    if (sum === 0) {
      tempStart = i;
    }

    // Step: Inspect element
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 9,
      arraySnapshot: elements.map((e) => ({ ...e })),
      currentIndex: i,
      currentSum: sum,
      maxSum,
      tempStart,
      bestStart,
      bestEnd,
      actionType: 'inspect',
      actionTitle: `Inspect Index [${i}]: nums[${i}] = ${val}`,
      hinglishNarration: `Index [${i}] par element ${val} inspect kar rahe hain.`,
      whyRule: sum === 0
        ? `Previous sum = 0 tha, isliye index [${i}] naye candidate subarray ka start (tempStart = ${i}) ban gaya.`
        : `Current element ${val} ko running sum me include karne se pehle index evaluate kar rahe hain.`,
    });

    sum += val;

    // Step: Add to running sum
    steps.push({
      stepNumber: steps.length + 1,
      activeLine: 14,
      arraySnapshot: elements.map((e) => ({ ...e })),
      currentIndex: i,
      currentSum: sum,
      maxSum,
      tempStart,
      bestStart,
      bestEnd,
      actionType: 'add_sum',
      actionTitle: `Running Sum Updated: sum = sum + (${val}) → sum = ${sum}`,
      hinglishNarration: `Running sum mein ${val} add hua. Naya running sum = ${sum}.`,
      whyRule: 'Contiguous subarray ke total ko extend karne ke liye current element ko running sum me add kiya gaya.',
    });

    // Step: Check if new maxSum found
    if (sum > maxSum) {
      maxSum = sum;
      bestStart = tempStart;
      bestEnd = i;

      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 17,
        arraySnapshot: elements.map((e) => ({ ...e })),
        currentIndex: i,
        currentSum: sum,
        maxSum,
        tempStart,
        bestStart,
        bestEnd,
        actionType: 'update_max',
        actionTitle: `🎉 New Record Max Sum Found! maxSum = ${maxSum} [Range: ${bestStart}...${bestEnd}]`,
        hinglishNarration: `New Maximum Subarray Sum mil gaya! maxSum = ${maxSum}. Best range: [${bestStart} ... ${bestEnd}].`,
        whyRule: `Current running sum (${sum}) ab tak ke record maxSum se bada hai. Range [${bestStart} ... ${i}] naya benchmark hai!`,
      });
    }

    // Step: Check if sum drops below 0 -> Reset sum
    if (sum < 0) {
      steps.push({
        stepNumber: steps.length + 1,
        activeLine: 23,
        arraySnapshot: elements.map((e) => ({ ...e })),
        currentIndex: i,
        currentSum: sum,
        maxSum,
        tempStart,
        bestStart,
        bestEnd,
        actionType: 'reset_sum',
        actionTitle: `⚠️ Running Sum < 0 (sum = ${sum}) -> Discard Negative Prefix & Reset sum = 0`,
        hinglishNarration: `Running sum negative (${sum}) ho gaya! Negative prefix future sum ko ghatayega, isliye sum ko 0 par reset karte hain.`,
        whyRule: `🚨 CORE KADANE RULE: Negative sum prefix (${sum} < 0) ko carry forward karne se agle elements ka sum HAMESHA KAM hoga. Isliye is negative prefix ko drop karke sum = 0 reset karte hain!`,
      });

      sum = 0;
    }
  }

  // Final Completion Step
  steps.push({
    stepNumber: steps.length + 1,
    activeLine: 27,
    arraySnapshot: elements.map((e) => ({ ...e })),
    currentIndex: elements.length - 1,
    currentSum: sum,
    maxSum,
    tempStart,
    bestStart,
    bestEnd,
    actionType: 'complete',
    actionTitle: `🎉 Kadane's Execution Complete: Max Subarray Sum = ${maxSum}`,
    hinglishNarration: `Algorithm complete! Maximum contiguous subarray sum = ${maxSum}. Subarray range: [${bestStart} ... ${bestEnd}] -> [${initialArray.slice(bestStart, bestEnd + 1).join(', ')}].`,
    whyRule: `Single pass scan O(N) time & O(1) space me complete. Sabhi negative prefixes non-promising hone par drop ho gaye aur maximum contiguous total obtain ho gaya.`,
  });

  return steps;
}
