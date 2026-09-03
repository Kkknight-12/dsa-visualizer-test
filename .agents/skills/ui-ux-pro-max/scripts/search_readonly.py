#!/usr/bin/env python3
"""Fail-closed launcher for the local UI/UX search trial."""

from pathlib import Path
import runpy
import sys


FORBIDDEN_EXACT = {
    "--persist",
    "--force",
    "--output-dir",
    "-o",
    "--page",
}
FORBIDDEN_PREFIXES = (
    "--persist=",
    "--force=",
    "--output-dir=",
    "--page=",
)


def main() -> int:
    for argument in sys.argv[1:]:
        if argument in FORBIDDEN_EXACT or argument.startswith(FORBIDDEN_PREFIXES):
            print(
                f"error: {argument.split('=', 1)[0]} is disabled in the read-only trial",
                file=sys.stderr,
            )
            return 2

    donor_cli = Path(__file__).with_name("search.py")
    runpy.run_path(str(donor_cli), run_name="__main__")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
