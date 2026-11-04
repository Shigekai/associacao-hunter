# Testing

- **Test behavior, not style.** Assert what the user sees and what the code returns, never CSS or class names.
- **One behavior, one place.** Test a behavior in the component that owns it. A component that reuses another doesn't retest it.
- **Reusable mocks, central folder.** One per package: `frontend/test/mocks/`, `backend/test/mocks/` (created with the first test). No ad-hoc mocks inside test files when a shared one fits.

## Frontend

| Case | How |
|---|---|
| Async Server Component | Vitest can't render it: `await` it as a function, then `render` the result |
| Fake timers (debounce) | Use `fireEvent`, not user-event: Testing Library's async wrapper waits on a `setTimeout` that only Jest's fake timers advance, so user-event hangs under Vitest's |
| Request order or abort | `mockFetchQueue()`: each request waits until the test answers it, and aborting rejects it like the real `fetch` |
| `useRouter` | `mockRouter()`, with `vi.mock('next/navigation')` in the test file |
| `<search>` landmark | Testing Library's `aria-query` doesn't map it to the `search` role yet: reach the form through its submit button |
| Native behavior jsdom lacks (`inert`, form restore) | Check it in a real browser (Playwright, Chrome and WebKit) |
