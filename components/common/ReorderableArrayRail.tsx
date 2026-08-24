'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface ArrayBlockElement {
  id: string; // Unique persistent element ID for FLIP physical sliding
  val: number;
}

export interface PointerInfo {
  label: string;
  index: number;
  color: string; // Tailwind color class
  direction: 'up' | 'down';
}

interface ReorderableArrayRailProps {
  elements: ArrayBlockElement[];
  pointers?: PointerInfo[];
  swappingIndices?: [number, number];
  getColorConfig?: (val: number) => {
    bg: string;
    border: string;
    text: string;
    label: string;
  };
}

export function ReorderableArrayRail({
  elements,
  pointers = [],
  swappingIndices,
  getColorConfig,
}: ReorderableArrayRailProps) {
  const defaultGetColorConfig = (val: number) => {
    switch (val) {
      case 0:
        return {
          bg: 'bg-rose-500/25',
          border: 'border-rose-500/80',
          text: 'text-rose-200',
          label: 'Red',
        };
      case 1:
        return {
          bg: 'bg-slate-100 text-slate-950',
          border: 'border-white',
          text: 'text-slate-950 font-black',
          label: 'White',
        };
      case 2:
        return {
          bg: 'bg-sky-500/25',
          border: 'border-sky-500/80',
          text: 'text-sky-200',
          label: 'Blue',
        };
      default:
        return {
          bg: 'bg-slate-800',
          border: 'border-slate-700',
          text: 'text-slate-300',
          label: String(val),
        };
    }
  };

  const getColors = getColorConfig || defaultGetColorConfig;

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[240px] py-4 px-4 select-none">
      {/* Shared Flex Container — Direct Siblings enable Framer Motion FLIP Physical Sliding */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-5 w-full max-w-4xl">
        {elements.map((element, idx) => {
          const val = element.val;
          const colors = getColors(val);
          const isSwapping = swappingIndices?.includes(idx);
          const swapPosIdx = swappingIndices ? swappingIndices.indexOf(idx) : -1;

          // Find top & bottom pointers for this index
          const topPointers = pointers.filter((p) => p.index === idx && p.direction === 'down');
          const bottomPointers = pointers.filter((p) => p.index === idx && p.direction === 'up');

          // Arc Y-offset & Tilt applied strictly to the Array Cell Block (leaving Pointers 100% Stable)
          const arcY = isSwapping ? (swapPosIdx === 0 ? -28 : 28) : 0;
          const arcRotate = isSwapping ? (swapPosIdx === 0 ? -6 : 6) : 0;

          return (
            <motion.div
              key={element.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                layout: { type: 'spring', stiffness: 180, damping: 19 },
              }}
              className="relative flex flex-col items-center flex-1 max-w-[80px] min-w-[56px]"
            >
              {/* TOP POINTER TRACK (Slightly Larger Upright Text & Icon) */}
              <div className="h-14 flex items-end justify-center w-full mb-1">
                {topPointers.map((p) => (
                  <motion.div
                    key={`top-ptr-${p.label}`}
                    layoutId={`ptr-top-${p.label}`}
                    className="flex flex-col items-center gap-0.5"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-extrabold shadow-lg whitespace-nowrap tracking-wide ${p.color}`}
                    >
                      {p.label}={p.index}
                    </span>
                    <ArrowDown className="w-5 h-5 text-purple-400 animate-bounce" />
                  </motion.div>
                ))}
              </div>

              {/* PHYSICAL ARRAY CELL BLOCK */}
              <motion.div
                animate={{
                  y: arcY,
                  rotate: arcRotate,
                  scale: isSwapping ? 1.15 : 1,
                }}
                transition={{
                  y: { type: 'spring', stiffness: 260, damping: 20 },
                  rotate: { type: 'spring', stiffness: 260, damping: 20 },
                  scale: { duration: 0.2 },
                }}
                className={`relative w-full h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl transition-colors ${
                  colors.bg
                } ${colors.border} ${colors.text} ${
                  isSwapping ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/50 z-30' : ''
                }`}
              >
                {/* Index Indicator */}
                <span className="absolute top-1.5 left-2 text-[9px] font-mono text-slate-400 font-bold">
                  [{idx}]
                </span>

                {/* Swap Laser Badge */}
                {isSwapping && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px] font-mono shadow-lg tracking-wider"
                  >
                    SWAP ↔
                  </motion.span>
                )}

                {/* Main Value */}
                <span className="text-2xl font-black font-mono tracking-wider">
                  {val}
                </span>

                {/* Sub Label */}
                <span className="text-[9px] font-mono opacity-80 mt-0.5">
                  {colors.label}
                </span>
              </motion.div>

              {/* BOTTOM POINTER TRACK (Slightly Larger Upright Text & Icon) */}
              <div className="h-16 flex flex-col items-center justify-start gap-1 w-full mt-1">
                {bottomPointers.map((p) => (
                  <motion.div
                    key={`bot-ptr-${p.label}`}
                    layoutId={`ptr-bot-${p.label}`}
                    className="flex flex-col items-center gap-0.5"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <ArrowUp className={`w-5 h-5 ${p.label === 'low' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-extrabold shadow-lg whitespace-nowrap tracking-wide ${p.color}`}
                    >
                      {p.label}={p.index}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
