# User DSA & Development Guidelines

- **Teaching Style & Language**: Use Hinglish (Hindi + English) for explanations. Visual and intuitive, focusing on the "why" before the "how".
- **Two-Step DSA Process**:
    1. Create a `problem.md` file explaining all approaches (Brute, Better, Optimal) and ask the user to choose one.
    2. Create a `.ts` file for the chosen approach with extremely detailed comments and a dry run.
- **TypeScript Namespace**: All code should be in a TypeScript namespace.
- **Test Cases**: Every solution must include comprehensive test cases.
- **Chrome DevTools UI Verification (MANDATORY)**: Always use Chrome DevTools MCP (`chrome-devtools` server: `navigate_page`, `evaluate_script`, `take_screenshot`) to thoroughly verify, inspect, and test the UI layout, responsive bounds, and visual alignments immediately after working on or modifying any UI.
