# Testing

- **Test behavior, not style.** Assert what the user sees and what the code returns, never CSS or class names.
- **One behavior, one place.** Test a behavior in the component that owns it. A component that reuses another doesn't retest it.
- **Reusable mocks, central folder.** One per package: `frontend/test/mocks/`, `backend/test/mocks/` (created with the first test). No ad-hoc mocks inside test files when a shared one fits.
