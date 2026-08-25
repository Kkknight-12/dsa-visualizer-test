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
- **5-Tab Master Guide (`*ProblemInfo.tsx`) Component Structure & Text Invariant**:
  - Every completed problem page MUST include a 5-tab `<*ProblemInfo />` master guide component (`components/*/*ProblemInfo.tsx`) mounted above the main visualizer studio grid:
    - **Tab 1: Overview & Examples Table**: Problem definition, core rules, example inputs/outputs.
    - **Tab 2: Visual Intuition & Dynamic Region/Graph Diagrams**: Rich custom visual graphics (e.g., Mountain peak bar graphs, DNF 4-region invariant rails, Running Sum SVG waveform charts, 3-Stage Tree Subtree Hierarchy cards).
    - **Tab 3: Interactive Morphing Canvas & Full Written Breakdown**:
      - Interactive frame-by-frame snapshot canvas with color-coded element blocks and floating pointer badges (`LOW`, `MID`, `HIGH`, `i`).
      - **CRITICAL INVARIANT (No Text Compression)**: Always keep the complete written stage-by-stage breakdown list (Stage 1, Stage 2, Stage 3 with WHY rules) right below the canvas. Adding visual diagrams MUST NOT compress, truncate, or omit written text explanations!
    - **Tab 4: Mathematical Proofs & Invariants**: Formal proofs (e.g., Array reversal trick proof, DNF boundary preservation, Negative prefix sum discard proof $X + S < X$, 2-Stack LIFO reverse preorder identity).
    - **Tab 5: Complexity Benchmarks & Edge Cases**: Time & space complexity badges, handling of empty inputs, single element, all-negative/all-positive arrays.
- **JSX Character Escaping Invariant**: In Next.js / React JSX text nodes inside `<li>`, `<td>`, `<p>`, `<span>`, `<strong>`, or `<div>`, raw `<` or `>` characters trigger Turbopack build errors (`TS1382: Unexpected token`). Always escape as `&lt;` and `&gt;` or wrap inside `<code className="...">`.
- **Reusable Array Rail (`components/common/ReorderableArrayRail.tsx`)**:
  - Mandatory for all Array/Pointer visualizers. Supports FLIP animations, pointer badges, and `highlightedRange` with glowing gold borders + `MAX 🏆` laser badges.
  - **Generic Neutral Block Styling**: By default, elements render with clean dark-slate cards (`bg-slate-900/90`, `border-slate-700/80`, `label: ''`). Problem-specific colors (e.g. Dutch Flag Red/White/Blue) must be passed via the `getColorConfig` prop, never hardcoded into default configurations.
  - **Standard `PointerInfo` Interface & Stable `layoutId` Invariant**:
    - Top and bottom pointer badges use `{ id?: string, label: string, index: number, color: string, direction: 'up' | 'down' }`.
    - ALWAYS pass persistent `id`s (e.g., `id: 'anchor-i'`, `id: 'ptr-left'`, `id: 'ptr-right'`). NEVER use dynamic values like `label: 'i=0'` as the raw `layoutId`, as this breaks Framer Motion position interpolation and causes jarring unmounts.
  - **Fluid Pointer Gliding & Spring Physics Invariant**:
    - Standardize gentle, controlled spring physics for all pointer tracks and array block layouts: `const smoothSpringTransition: Transition = { type: 'spring', stiffness: 110, damping: 18, mass: 0.85 }`.
    - Avoid high stiffness values (>200) or CSS `animate-bounce` on pointer icons to ensure silky-smooth, fluid motion across indices without snappy/jerky jumps.
  - **Active Element Focus Highlighting**: Actively evaluated pointer indices (`i`, `left`, `right`, `slow`, `fast`) must receive glowing color-coded rings/badges (Amber, Sky, Purple) while inactive elements are dimmed (`opacity-60`).
  - **Multi-Pointer Math Equation Strip & Target Comparison Gauge**:
    - In all multi-pointer/calculation problems (e.g., 3Sum, Container With Most Water, Two Sum), mount a live calculation strip (`*MathStrip.tsx`) showing:
      1. **Live Equation Blocks**: Color-coded boxes for each pointer term evaluating to `Current Sum / Metric`.
      2. **Target Comparison Widget**: Displays `Target Metric` with dynamic action verdicts (e.g., `SUM TOO LOW (< 0) → Move LEFT++`, `SUM TOO HIGH (> 0) → Move RIGHT--`, `MATCH FOUND`).
      3. **Explicit Pointer Movement Banners**: Clearly indicates which pointer moved, directional delta (`Index X → Y` with `➡️`/`⬅️` arrows), and the exact decision rule reason.
  - **FLIP Block Swap & Motion Invariant**: ALWAYS generate persistent `arraySnapshot: ArrayBlockElement[]` with stable block `id`s (e.g. `np-elem-${originalIndex}-${val}`) directly inside simulation step generators (`lib/*Simulation.ts`). Mutate `arraySnapshot` positions during swaps/reversals and pass `currentStep.arraySnapshot` directly to `ReorderableArrayRail`. NEVER re-map elements by array index (`id: elem-${idx}`) in page components as it breaks FLIP sliding transitions.
  - **Defensive Null-Safe Step Rendering**: Always use optional chaining with safe defaults (`currentStep?.activeLine ?? 1`, `currentStep?.stepNumber ?? 1`) in `*CodeRunner.tsx` and `*ExplanationPanel.tsx` to prevent hydration frame exceptions before simulation steps settle.
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
