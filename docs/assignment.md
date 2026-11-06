# Assignment — BD2, Part 01: Application

Source: `trabalho-banco-de-dados02.pdf` (UNESP, Banco de Dados II). Build an app that other people use, on top of the database designed in BD1 (Grupo L, Hunter × Hunter).

## Requirements

| # | Requirement | In practice |
|---|---|---|
| R1 | Web/mobile/desktop app connected to a cloud database | PostgreSQL on Neon (≥ 15) |
| R2 | Show data from queries with joins and conditions | No per-table `SELECT *` screens |
| R3 | A real reason to exist | Hunter Association registry: look up hunters and their Nen |
| R4 | One theme: **(A)** statistical dashboard or **(B)** complex searches made simple **plus inserting data** | **B** (Node.js) |
| R5 | Hosted | Render |

## Deliverables

- GitHub repository link.
- Live app link.
- Built on the BD1 database, no rework.

## Grading

1. Requirements met.
2. Database integration.
3. Use of the database to serve the app's needs.
4. Recommended technologies (Streamlit, Node.js, Express, Render, Neon) or equivalents.
5. User experience and usefulness.

## Known gap

Theme B asks for user insertion. The MVP has none (data is added by SQL scripts); a registration screen is left to the team. Accepted risk.

## To confirm with the professor

- Does a hunter registry meet R3?
- Is insertion through SQL scripts acceptable, or is a registration screen required?
- Does renaming the BD1 schema to English (same structure) count as building on BD1?
