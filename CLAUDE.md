# associacao-hunter

Hunter Association app (UNESP BD2) over the Hunter × Hunter database from BD1.

| What | Where |
|---|---|
| Docs, naming, testing rules | `docs/docs.md`, `docs/naming.md`, `docs/testing.md` |
| Assignment / database reference | `docs/assignment.md`, `docs/database.md` |
| Schema and seed | `database/schema.sql`, `database/seed.sql` |
| Node version | 24 (`.nvmrc`, `nvm use`) |
| Backend (Express, `npm run dev` → :3001) | `backend/src/` |
| Backend tests (`npm test`, drops and recreates `TEST_DATABASE_URL`) | `backend/test/` |
| Frontend (Next.js routing only, `npm run dev` → :3000) | `frontend/app/` |
| Task specs (local, gitignored) | `.claude/specs/` |
| Visual references | `assets/` |
| Branching | `feature/*` → `develop` → `main`, no PRs |
