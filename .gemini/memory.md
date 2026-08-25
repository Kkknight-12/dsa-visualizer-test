# Antigravity DSA Visualizer Memory

## 1. Git & Workflow Rules (STRICT)
- **NO AUTO COMMIT / PUSH**: NEVER run `git commit` or `git push` without asking the user for explicit approval first. Always ask the user before staging, committing, or pushing code.

## 2. Teaching Style & Workflow
- **Hinglish Style**: Use Hindi + English for intuitive, visual DSA explanations ("why" before "how").
- **Two-Step Solution Workflow**:
  1. Create a `problem.md` explaining Brute, Better, and Optimal approaches.
  2. Create a `.ts` file for chosen approach inside TS namespace with detailed comments, dry run, and comprehensive test cases.

## 3. DSA Visualizer Studio Conventions (`dsa-visualizer-test`)
- **2D/SVG Focus (3D Postponed)**: High-performance 2D/SVG interactive visualizers with Framer Motion.
- **Reusable Array Rail (`components/common/ReorderableArrayRail.tsx`)**:
  - Mandatory for all Array/Pointer visualizers. Supports FLIP animations, pointer badges, and `highlightedRange` with glowing gold borders + `MAX 🏆` laser badges.
- **Playthrough Controls & UI Layout**:
  - **No Blocking Modals**: Keep code runner and canvas 100% visible upon playthrough completion.
  - **Inline Result Banner**: Render non-blocking final summary banner in canvas action footer (`actionType === 'complete'`).
  - **Timeline Controls**: Include Reset, Previous Step (`SkipBack`), Play/Pause, Next Step (`SkipForward`), and Speed controls.
  - **Step Logic & Intuition**: Render dedicated **🧠 LOGIC & INTUITION** panel in canvas footer explaining the "WHY Rule" for every step.
- **Shiki Code Runner Auto-Centering**:
  - Auto-scroll active line to vertical midpoint inside `requestAnimationFrame`.

## 4. Mandatory Verification
- **Chrome DevTools MCP**: Always verify UI changes immediately via `navigate_page`, `evaluate_script`, and `take_screenshot`.
