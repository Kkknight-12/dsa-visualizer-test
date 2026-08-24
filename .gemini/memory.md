# User DSA & Development Guidelines

- **Teaching Style & Language**: Use Hinglish (Hindi + English) for explanations. Visual and intuitive, focusing on the "why" before the "how".
- **Two-Step DSA Process**:
    1. Create a `problem.md` file explaining all approaches (Brute, Better, Optimal) and ask the user to choose one.
    2. Create a `.ts` file for the chosen approach with extremely detailed comments and a dry run.
- **TypeScript Namespace**: All code should be in a TypeScript namespace.
- **Test Cases**: Every solution must include comprehensive test cases.
- **2D/SVG Visualizer Focus (3D Postponed)**: Focus on clean, high-performance 2D/SVG interactive visualizers with Framer Motion. Advanced 3D / Three.js models and WebGL animations are **postponed for now** (not permanently dropped) because high-fidelity 3D models and smooth 3D animations require further iteration.
- **Chrome DevTools UI Verification (MANDATORY)**: Always use Chrome DevTools MCP (`chrome-devtools` server: `navigate_page`, `evaluate_script`, `take_screenshot`) to thoroughly verify, inspect, and test the UI layout, responsive bounds, and visual alignments immediately after working on or modifying any UI.
- **Shiki Code Runner Line Auto-Centering**: Use `element.offsetTop - container.clientHeight/2 + element.clientHeight/2` on `requestAnimationFrame` for auto-centering active lines without artificial spacer divs or CSS `scroll-smooth` conflicts.
- **Multi-Layout Visualizer Studio**: Offer Dual-Pane (Side-by-Side Code & Canvas) and Smart Action Dock (Phase-based auto-switching) modes for optimal visibility.
- **Striver A2Z Sheet Blueprint**: Follow `STRIVER_A2Z_VISUALIZER_BLUEPRINT.md` for standard visualizer archetypes across Arrays, LL, Stacks, Trees, Graphs, DP, and Trie.
