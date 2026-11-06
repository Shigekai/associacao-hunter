# Styling

- **Visual source of truth:** the prototype ([Associação Hunter — App](https://claude.ai/artifact/Kvr1UQJ2FSK5Vez5ENMXKC)), board "Sistema visual" for tokens. It wins over older notes.
- **Tailwind utilities by default.** Tokens live in `frontend/app/theme.css` (`@theme`). Tailwind's default palette and breakpoints are removed: only project colors (`bg-ink`, `text-accent`, `border-line`…) exist. Other default scales (text, shadow, spacing…) remain next to the project tokens; prefer the project ones.
- **One breakpoint:** `desktop:` (≥ 1024 px). Write mobile first.
- **Form controls use 16 px text on mobile** (`text-base`): iOS zooms in on a focused control with smaller text.
- **`clsx` for conditional classes.** Prettier sorts the classes inside `clsx(...)` too (`tailwindFunctions`).
- **CSS Modules are valid for keyframe animations** (multi-step `@keyframes`, staggered delays, `prefers-reduced-motion`). Tailwind keeps layout, color and type; the module keeps only the animation. Read tokens with `var(--color-*)`, never hex. Example: `frontend/components/LoadingIndicator.module.css`.
  - Module rules are unlayered, so they beat any Tailwind utility on the same element: keep sizes and radii in Tailwind.
  - A delay that changes per breakpoint goes in a Tailwind arbitrary property (`[--delay:0.3s] desktop:[--delay:0s]`), read by the module as `var(--delay)`. Example: `frontend/components/results/ResultsSkeleton.tsx`.
- **Line height:** text inherits 1.5; the prototype renders `normal`. Where a height must match the prototype (the chips: 25/26 px, like their skeleton), set `leading-*`.
- **Buttons:** `buttonClassName({ variant, size })` in `frontend/components/Button.tsx` is the one recipe. A link styled as a button is a `ButtonLink`, never a `<button>` inside `<a>`.
- **Dot patterns:** `halftone` (portrait placeholder) and `skeleton` (loading blocks) are `@utility` in `theme.css`.
- **`Disclosure`** (`frontend/components/Disclosure.tsx`): a `<details>` animated with `details-content:` and `transition-discrete`. Animating to `auto` needs `interpolate-size: allow-keywords`, set once on `:root` in `globals.css` (Tailwind has no utility for it). Safari has `::details-content` but not `interpolate-size`: it opens without animating. The caller styles the `summary` and its arrow (`group-open:rotate-180`).
- **Stretched link** (a whole card as one link): the card is `relative isolate`, the link gets `after:absolute after:inset-0`, controls that must stay clickable get `relative z-10`, decoration behind the text gets `-z-10`. Leave every element between the card and the link unpositioned, or the link covers only that element.
