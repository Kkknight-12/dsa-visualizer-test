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
- **Playthrough Controls & UI Layout**:
  - **No Blocking Modals**: Keep code runner and canvas 100% visible upon playthrough completion.
  - **Dedicated Explanation Panel**: Separate Code Visual Block (Canvas) from Code Explanation & Core DSA Logic Panel (`KadanesExplanationPanel.tsx`).
  - **Timeline Controls**: Include Reset, Previous Step (`SkipBack`), Play/Pause, Next Step (`SkipForward`), and Speed controls.
- **Shiki Code Runner Auto-Centering**:
  - Auto-scroll active line to vertical midpoint inside `requestAnimationFrame`.

## 5. Mandatory Verification
- **Chrome DevTools MCP**: Always verify UI changes immediately via `navigate_page`, `evaluate_script`, and `take_screenshot`.
