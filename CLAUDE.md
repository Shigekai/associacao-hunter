# associacao-hunter

Hunter Association app (UNESP BD2) over the Hunter × Hunter database from BD1.

| What | Where |
|---|---|
| Docs, naming, styling, testing rules | `docs/docs.md`, `docs/naming.md`, `docs/styling.md`, `docs/testing.md` |
| Assignment / database reference | `docs/assignment.md`, `docs/database.md` |
| Schema and seed | `database/schema.sql`, `database/seed.sql` |
| Node version | 24 (`.nvmrc`, `nvm use`) |
| Backend (Express, `npm run dev` → :3001) | `backend/src/` |
| Frontend (Next.js routing only, `npm run dev` → :3000) | `frontend/app/` (routes), `frontend/components/`, `frontend/lib/` |
| Tests (`npm test` per package; backend drops and recreates `TEST_DATABASE_URL`) | `backend/test/`, `frontend/test/` |
| Task specs (local, gitignored) | `.claude/specs/` |
| Design prototype / source art (emblem, characters) | [canvas](https://claude.ai/artifact/Kvr1UQJ2FSK5Vez5ENMXKC) / `assets/` |
| Branching | `feature/*` → `develop` → `main`, no PRs |
