# Omnia — Finance Assistant

A lightweight, client-side finance assistant prototype built with React, Vite, and Tailwind CSS. Created for HackMTY 2025, this app provides visual budgeting tools, savings and emergency fund planning, and short- and long-term financial overviews.

This repository contains the frontend UI and components for the Omnia finance assistant.

## Highlights

- Interactive budget breakdowns and savings overviews
- Emergency fund and end-of-month survival planning components
- Data-driven charts using Recharts and custom visual components
- Built with Vite for fast development and Tailwind CSS for utility-first styling

## Tech stack

- Framework: React 18
- Bundler: Vite
- Styling: Tailwind CSS + PostCSS
- Charts/Visuals: Recharts, react-three (three.js integrations)
- HTTP: Axios

Exact dependencies are in `package.json`.

## Quick start (macOS / zsh)

1. Install dependencies

```bash
yarn
```

2. Start development server (hot reloading)

```bash
yarn start
```

Notes:

- The project uses Vite. By default the dev server runs on http://localhost:5173 unless configured otherwise.
- `npm test` is currently mapped to `vite` in `package.json` and may be adjusted if tests are added.

## Project structure

Top-level:

- `index.html` — Vite entry HTML
- `src/` — React source code
- `public/` — static assets (animations, models)

src folder highlights:

- `src/main.jsx` — app bootstrap
- `src/App.jsx` — top-level app component
- `src/index.css` — Tailwind + app styles
- `src/components/` — reusable UI components (see list below)
- `src/hooks/` — custom hooks and utilities (e.g., axios instance)

Key components (brief):

- `Avatar.jsx` — visual avatar (3D / interactive)
- `BudgetBreakdown.jsx` — budget category visualization
- `BudgetStore.js` — client-side store for budget data
- `EmergencyPlanFund.jsx` — emergency fund planning UI
- `EndOfMonthSurvivalPlanOverview.jsx` — survival plan summary
- `Experience.jsx` — likely onboarding or UX demo component
- `LongTermPlan.jsx` — long-term financial planning UI
- `ReviewPanel.jsx` — review / summary panel
- `SavingsOverview.jsx` — savings visualizations
- `ShortTermGoalsPlan.jsx` — short-term goal planner
- `UI.jsx` — shared UI building blocks

See the `src/components` files for implementation details and props.

## Development notes

- Tailwind is configured via `tailwind.config.js`. Styles are imported in `src/index.css`.
- PostCSS is configured in `postcss.config.js`.

## Recommended edits & contribution

1. Fork & branch from `main`.
2. Open a PR with a clear description and small, focused changes.

## Scripts (from package.json)

- `yarn start` — start Vite dev server

## Troubleshooting

- If you see styling issues: ensure Tailwind directives are present in `src/index.css` and that the Tailwind config matches your file globs.
- If Vite fails to start: ensure Node.js is up-to-date (recommended >= 16) and re-run `npm install`.
