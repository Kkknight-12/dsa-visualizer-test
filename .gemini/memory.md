# Antigravity DSA Visualizer Memory

## 1. Git & Workflow Rules (STRICT)
- **NO AUTO COMMIT / PUSH**: NEVER run `git commit` or `git push` without asking the user for explicit approval first. Always ask the user before staging, committing, or pushing code.

## 2. Teaching Style & Workflow
- **Hinglish Style**: Use Hindi + English for intuitive, visual DSA explanations ("why" before "how").
- **Two-Step Solution Workflow**:
  1. Create a `problem.md` explaining Brute, Better, and Optimal approaches.
  2. Create a `.ts` file for chosen approach inside TS namespace with detailed comments, dry run, and comprehensive test cases.

## 3. Typography & Font System (Mandatory for ALL Pages)
- **UI / Body Sans-Serif Font**: **`Inter`** loaded via `next/font/google` (`--font-inter`). Used across page titles, headers, card narration, and Hinglish step explanations.
- **Code & Telemetry Monospace Font**: **`JetBrains Mono`** loaded via `next/font/google` (`--font-jetbrains-mono`). Used for code blocks, line numbers, array block values (`text-2xl font-black`), telemetry metrics (`text-2xl`/`text-3xl`), step counters, and range badges.
- **Font Size Hierarchy**:
  - Page Titles: `text-lg` / `text-xl` font-extrabold
  - Card Headers: `text-base` font-bold
  - Body & Narration Text: `text-sm` / `text-base` leading-relaxed
  - Code Lines (Shiki): `text-sm` / `text-[13.5px]` leading-relaxed
  - Line Numbers & Micro Badges: `text-xs` font-mono font-bold
  - Array Element Values: `text-2xl font-black font-mono`

## 4. DSA Visualizer Studio Conventions (`dsa-visualizer-test`)
- **2D/SVG Focus (3D Postponed)**: High-performance 2D/SVG interactive visualizers with Framer Motion.
- **Reusable Array Rail (`components/common/ReorderableArrayRail.tsx`)**:
  - Mandatory for all Array/Pointer visualizers. Supports FLIP animations, pointer badges, and `highlightedRange` with glowing gold borders + `MAX 🏆` laser badges.
  - **FLIP Block Swap & Motion Invariant**: ALWAYS generate persistent `arraySnapshot: ArrayBlockElement[]` with stable block `id`s (e.g. `np-elem-${originalIndex}-${val}`) directly inside simulation step generators (`lib/*Simulation.ts`). Mutate `arraySnapshot` positions during swaps/reversals and pass `currentStep.arraySnapshot` directly to `ReorderableArrayRail`. NEVER re-map elements by array index (`id: elem-${idx}`) in page components as it breaks FLIP sliding transitions.
- **Playthrough Controls & UI Layout**:
  - **No Blocking Modals**: Keep code runner and canvas 100% visible upon playthrough completion.
  - **Dedicated Explanation Panel**: Separate Code Visual Block (Canvas) from Code Explanation & Core DSA Logic Panel (`KadanesExplanationPanel.tsx`, `SortColorsExplanationPanel.tsx`, `PostorderExplanationPanel.tsx`).
  - **Timeline Controls**: Include Reset, Previous Step (`SkipBack`), Play/Pause, Next Step (`SkipForward`), and Speed controls.
- **Standard Dual-Pane Studio Layout (`lg:grid-cols-12`)**:
  - **Left Column (`lg:col-span-5`)**:
    1. **Top**: `ShikiCodeRunner` (TypeScript Code Runner with smooth active line auto-centering).
    2. **Directly Under Code Editor**: Dedicated `Step Explanation & Core DSA Logic` panel (`*ExplanationPanel.tsx`).
  - **Right Column (`lg:col-span-7`)**:
    1. **Top**: Live Data Structures & Visual Canvas (SVG Tree, Stack, Reorderable Array Rail).
    2. **Middle**: Dynamic Workstations & Execution Engines (Phase Morphing, DataFlow Pipeline).
    3. **Bottom / Last Section**: `Expanding Result Array: const result: number[]` (`AnimatedResultMotion`).
- **Step Explanation Panel Header & Card Standards**:
  - **Header Bar (Clear 2 Columns)**: Title on top line (`text-base sm:text-lg font-extrabold`), Subtitle explicitly on the **next line** below it (`text-xs text-slate-400 font-mono mt-1 block`); Right column has `shrink-0` badges (`LINE X` & `Step X / N`).
  - **Body Cards (Full-Width Vertical Stack)**: Cards MUST be stacked vertically (`flex flex-col gap-3.5`) inside 5-span parent columns. Top Card: Code Action & Hinglish Narration (`text-sm sm:text-base`). Bottom Card: Core DSA Logic & Intuition ("WHY Rule") (`text-sm sm:text-base text-amber-100`).
- **Shiki Code Runner Auto-Centering**:
  - Auto-scroll active line to vertical midpoint inside `requestAnimationFrame`.

## 5. Mandatory Verification
- **Chrome DevTools MCP**: Always verify UI changes immediately via `navigate_page`, `evaluate_script`, and `take_screenshot`.
