# Styling

- **Visual source of truth:** the prototype ([Associação Hunter — App](https://claude.ai/artifact/Kvr1UQJ2FSK5Vez5ENMXKC)), board "Sistema visual" for tokens. It wins over older notes.
- **Tailwind utilities by default.** Tokens live in `frontend/app/theme.css` (`@theme`). Tailwind's default palette and breakpoints are removed: only project colors (`bg-ink`, `text-accent`, `border-line`…) exist. Other default scales (text, shadow, spacing…) remain next to the project tokens; prefer the project ones.
- **One breakpoint:** `desktop:` (≥ 1024 px). Write mobile first.
- **CSS Modules are valid for keyframe animations** (multi-step `@keyframes`, staggered delays, `prefers-reduced-motion`). Tailwind keeps layout, color and type; the module keeps only the animation. Read tokens with `var(--color-*)`, never hex. Example: `frontend/components/LoadingIndicator.module.css`.
