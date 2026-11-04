# Documentation

- **Lean:** document only what the code doesn't make obvious.
- **Direct:** lead with the point; tables and bullets over prose.
- **Not verbose:** short sentences, no filler.
- **English.** Exception: task specs in `.claude/specs/` (local, follow the task workflow language).
- **No comments in code.** A constraint, a browser quirk or a workaround goes in `docs/`, not in the middle of the code. Tool directives (`// @vitest-environment`, `eslint-disable`) aren't comments and stay.
