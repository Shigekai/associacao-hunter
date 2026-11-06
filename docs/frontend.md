# Frontend

Next.js only routes; every piece of data comes from the Express API.

## Data

| From | Through | Why |
|---|---|---|
| Server Components | `frontend/lib/api.ts` (`server-only`) | `API_URL` never reaches the browser |
| Client components | Route handlers in `frontend/app/api/` (thin GET proxies to Express) | Same origin, no public API URL, no CORS |

- Every read calls `connection()` first: prerendering stops there, so the build never needs the API running.
- Requests time out after 60 s: Render's free tier holds the request while the service wakes up.
- Trailing slashes are stripped from `API_URL` (`/health` would become `//health`, which Express doesn't match).
- Route handler errors answer `502 { error }`; the cause is logged on the server.

## Search (`/search`)

| Behavior | Why |
|---|---|
| `<form action="/hunters" method="get">` with a `name` on each field | A click before hydration still searches through a native GET. Without any JS the form doesn't show: it streams inside `<Suspense>` |
| `autocomplete="off"` on the form | On a full reload the browser would restore the selects without Formik knowing, and the search would differ from the screen |
| The name combobox remounts (`key`) on submit and reset | Closes the list and cancels a pending request; Next keeps the page (Activity) when the user comes back, so the list must not stay open |
| Suggestions: 300 ms debounce on the request only; the previous list stays until the next answer | The field reacts at once and the list doesn't flicker |
| A list from an earlier term is `inert` (dimmed, no active option) | Enter and clicks can't pick a suggestion for a term the user already changed; Enter searches what was typed |
| The list's box stays outside `inert` and keeps focus on `mousedown` | `inert` ignores the pointer like `pointer-events: none`: clicks would fall through to the fields below |
| A match by nickname shows without bold | The term isn't in the displayed name |
| The license card has no `overflow-hidden` | It would clip the suggestions list |
| The `<Suspense>` fallback reserves the fields' height | The card doesn't jump when they arrive |

Native HTML considered: `<search>`, `inert`, `enterkeyhint="search"`, native GET and `type="reset"` are used. `<datalist>` can't show the prototype's count, bold match or empty message. `type="search"` has a native clear button only in Chrome and Safari, smaller than the 44 px target, and its Escape clears the field instead of closing the list.

## Results (`/hunters`)

| Behavior | Why |
|---|---|
| Filters go through `lib/utils.ts` (`readFilters`, `huntersPath`, `withFilters`) | One normalization: empty values (the native GET sends them) dropped, the first of a repeated key, trimmed, fixed order |
| `/characters` plus only the lists of the active select filters, in parallel | The chips need the filter names; without a select filter it is one request |
| API 400 or an empty list → `notFound()` → the root `app/not-found.tsx` | The not-found page gets no props, so it shows no chips. The same page answers unknown URLs and an unknown hunter. Once streaming has started, Next answers 200 + `noindex`, and the tab keeps the page title ("Resultados"); only an unknown URL shows "Não encontrado" (accepted) |
| A chip whose id is missing from its list is left out | Defensive: the list and the search can disagree |
| The card is an `<article>` with a stretched link on the name (recipe in `docs/styling.md`) | `<details>` can't sit inside `<a>`. The whole card opens the sheet; hovering anywhere underlines the name, and its text can't be selected with the mouse (accepted) |
| `prefetch={false}` on the card link | With filters in the URL, Next's intercepted-route prefetch predicts the wrong tree and falls back to a full reload on click (4 API requests instead of 1) |
| Grid `auto-fill` with a 22rem minimum, `items-start` | 3 columns at 1366 px and 2 at 1024 px with no new breakpoint; an open card grows alone |
| The affiliation filter finds past members; the card lists current affiliations only | API behavior (SPEC-02): Hisoka matches Trupe Fantasma and shows Associação Hunter (accepted) |
| Portrait: `public/characters/<slugify(full name)>.jpg`, found with `existsSync` from `process.cwd()` | The filesystem is the list. The server must run from `frontend/` (Render's `npm start` does). The copies come from `assets/characters/`; Netero's is cropped (empty top) |
| Card portrait `sizes` is 240/210 px, wider than its 132/108 px column | `object-cover` scales by height, so the widest picture (Netero, 736 × 768) shows 231/205 px wide. A smaller `sizes` makes the browser fetch a smaller file and stretch it (blurry). Recompute it for a wider picture |
| `images.qualities: [75, 85]`, portraits at 85; `imageSizes` adds 512 | Line art blurs at 75. 512 keeps 2× screens off the 640 file. A `quality` missing from the list is served at the closest listed one, with no error: without 85, the portraits would quietly ship at 75 |
| The chips list has `tabIndex={0}` | WebKit leaves the mobile scroll strip out of the Tab order. On desktop, where the list wraps, it is one extra Tab stop (accepted: dropping it there needs client JS) |
| Back is a `<Link>` to `/search` | Activity restores the filled form (Next keeps up to 3 routes); `router.back()` would leave the site from a shared link |

Native HTML considered: `<details>`/`<summary>` for the affiliations (works before hydration), `<ul>` for the chips and the grid, CSS `scroll-snap` for the chips strip.

## Sheet (`/hunters/[hunterId]`)

| Behavior | Why |
|---|---|
| `React.cache` around `getCharacterSheet` | `AbortSignal.timeout` disables Next's `fetch` memoization; the page and `generateMetadata` share one request |
| Intercepted route `hunters/@sheet/(.)[hunterId]` on card click; `hunters/[hunterId]/page.tsx` on reload or direct link | A click fetches only the sheet and keeps the list in `children`; a reload renders `ResultsMain` + the modal in parallel (2 requests). A plain parallel slot would fall back to `default.tsx`, which gets no `searchParams` |
| `<dialog open>` on the server as the veil itself, `::backdrop` transparent | Renders in place before hydration and doesn't shift when promoted to modal |
| `useLayoutEffect` removes `open` before `showModal()`, then focuses the `<dialog>` (`tabIndex={-1}`) | `showModal()` throws `InvalidStateError` on an open `<dialog>`. Focusing the `<dialog>` keeps focus inside the modal when streaming replaces the loading placeholder's close button (otherwise focus drops to `body`); the first Tab lands on the close button |
| Listen to `close`, not `cancel`; cleanup removes the listener and calls `close()` | Without user interaction in between, Chrome skips `cancel` on a second Escape. Calling `close()` while the `<dialog>` is still in the DOM restores focus to the card and clears `:modal` so Activity hiding the route doesn't leave `body:has(dialog:modal)` scroll-locked |
| On hydration, a `<dialog>` already closed navigates instead of opening (first run only) | The X is a native `<form method="dialog">`: clicked before hydration, it closes the dialog with no listener yet. Later runs (Activity showing the route again) find it closed by the cleanup and reopen it |
| `close="back"` (`router.back()`) from the intercepted route; `close="list"` (`router.replace('/hunters' + location.search)`) from the full page | From a shared link, `back()` would leave the site. Closing after a reload fetches the list again because `children` changes page (accepted) |
| `SheetTitle` reads `useId()` from `SheetDialog` context; section headings prefix ids with `sheet-${id}` | Server `useId()` resets per RSC request: after a reload on one hunter, opening another in the intercepted slot would collide on heading and `aria-labelledby` ids |
| `SheetError` (`catchError`) inside the modal, and `sheetMetadata` returns `{}` on error | When the API fails on a card click, the error stays inside the modal over the results list instead of crashing the route (`generateMetadata` runs outside `SheetError`). On a reload with the API down, the list also fails and hits Next's default error page (accepted) |
| Single grid markup for desktop (`290px · 1fr · 340px`) and mobile (`contents` on the middle column) | Reorders portrait, status and sections without duplicating DOM |
| Portrait `sizes` is 520 px on desktop, wider than its 340 px column | `object-cover` scales by height (540 px), so the widest portrait (Netero) renders 518 px wide |
| `/hunters/3?<filters with no results>` hits the root not-found | `ResultsLoader` calls `notFound()` when the background list is empty (accepted) |

Native HTML considered: `<dialog>` with `showModal()`, `<form method="dialog">`, `:modal`, `<meter>`, `<details>` (`Disclosure`), `:has()`. Server `inert` is unnecessary once `showModal()` makes the page inert; `closedby="any"` is skipped because the `<dialog>` is the veil itself (no outside backdrop to click).
