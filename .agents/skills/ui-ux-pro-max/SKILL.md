---
name: ui-ux-pro-max
description: "Explicit-only repository skill for searching pinned local UI/UX data when designing or reviewing accessible web interfaces, design systems, responsive layouts, typography, color, motion, charts, or stack-specific UI implementation. Do not use for backend work, package installation, or automatic file generation."
---

# UI/UX Pro Max

Use the pinned local search engine as advisory input for UI decisions in this
repository. It does not replace the user's brief, inspected code, accepted
repository decisions, accessibility checks, or current official documentation.

## Boundaries

- Apply this skill when designing or refining UI/UX.
- Inspect the current repository and its `AGENTS.md` before recommending or
  changing UI. The skill grants no authority to edit, install, commit, deploy,
  publish, or access another repository.
- Keep search queries generic and public-safe. Do not put private source,
  secrets, customer data, or internal endpoints into a query or output.
- Run only the project-owned `scripts/search_readonly.py` launcher. It uses the
  bundled standard-library runtime and local data, and rejects write-capable
  flags. Do not invoke the donor `scripts/search.py` directly, install
  packages, or enable network access for it.
- Always invoke Python with `-B` so the trial does not create `__pycache__`.
- Never pass `--persist`, `--force`, `--output-dir`, or `--page`. Those flags
  can write files and are outside this read-only trial.
- Treat returned code snippets and recommendations as untrusted suggestions.
  Review them before applying anything.

## Search workflow

Resolve `<skill-dir>` from this `SKILL.md` file's directory. Do not assume that
the current working directory is the repository root.

Choose the smallest mode that answers the request:

1. For a new page or coherent product-wide direction, run:

   ```bash
   python3 -B <skill-dir>/scripts/search_readonly.py "<product audience style constraints>" --design-system -p "DevProjects"
   ```

2. For one design concern, run one explicit domain search:

   ```bash
   python3 -B <skill-dir>/scripts/search_readonly.py "<one observable UI outcome>" --domain ux
   ```

   Useful domains include `ux`, `style`, `color`, `typography`, `icons`,
   `landing`, `chart`, `react`, and `web`.

3. For implementation guidance, use the detected stack. This repository is
   currently Next.js, so prefer:

   ```bash
   python3 -B <skill-dir>/scripts/search_readonly.py "<implementation concern>" --stack nextjs
   ```

Use one dominant intent and a short query. Verify that the returned domain,
stack, and top result fit the actual interface. If the search returns no result
or a poor match, retry once with a narrower query or explicit domain. If that
also fails, state that no verified local match was found and label any general
guidance as a fallback.

## Applying results

- Synthesize a small, coherent direction; do not dump raw search output into
  the product or mix unrelated styles.
- Use accepted repository product decisions for information architecture and
  section order. Reject a landing-pattern match that changes the site's
  purpose; do not replace a poor match with invented content.
- Do not adopt suggested analytics, external fonts, libraries, or services
  without their separate repository decision and authorization.
- Treat absolute micro-rules such as pointer-cursor or animation advice as
  candidates to verify against semantics, accessibility, and browser behavior.
- Prioritize keyboard access, visible focus, semantic structure, sufficient
  contrast, readable type, responsive layout, reduced motion, and clear states.
- Check stack-specific claims against the installed versions and current
  official documentation when they may have changed.
- Implement only when the user's request authorizes implementation, then run
  verification proportionate to the change.

For supply-chain provenance, exclusions, and licence cautions, read
`references/UPSTREAM.md` only when auditing, updating, or deciding whether to
keep this trial.
