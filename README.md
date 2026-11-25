<div align="center">
  <img src="public/favicon.png" alt="GPAFlow" width="96" height="96" />

  # GPAFlow

  **Track, calculate, and forecast your GPA over four years**

  Persistent academic dashboard built with Next.js, React 19, and Supabase.
</div>

## Why GPAFlow?

Most GPA calculators are one-and-done: you enter marks, get a number, and lose it. GPAFlow is built as a long-term academic companion across an entire 4-year degree:

- **Track Trends:** Visualize SGPA and CGPA across 8 semesters with interactive charts.
- **Smart Predictions:** Calculate the exact grades needed next semester to hit your target CGPA.
- **Persistent Data:** Academic records are synced and secured via Supabase across devices.
- **Modern UI:** Built with glassmorphism, fluid CSS transitions, and a mobile-first layout.

## Supported Universities

GPAFlow uses a **Strategy Pattern** for grading so each university plugs in its own grading rules cleanly:

| University | Grading System | Status |
| :--- | :--- | :--- |
| **NUML** - National University of Modern Languages | Letter grades with 4.0 GPA scale | Supported |
| **GCWUF** - GC University for Women Faisalabad | Quality points table system | Supported |
| **GCUF (Arts)** - GC University Faisalabad | General & arts, ceil rounding | Supported |
| **GCUF (Engineering)** - GC University Faisalabad | Engineering, 55% pass limit | Supported |

> **Your university not listed?** Check [CONTRIBUTING.md](CONTRIBUTING.md) to add a new grading engine.

## Tech Stack

- **Core:** Next.js 16 (App Router), React 19, TypeScript
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Tooling:** Oxlint, Oxfmt, pnpm

## Getting Started

See [CONTRIBUTING.md](CONTRIBUTING.md) for environment variables, local setup, and contribution guidelines.

Built by [Fahad Shahbaz](https://fahadshahbaz.dev)
