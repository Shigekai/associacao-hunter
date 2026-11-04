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
