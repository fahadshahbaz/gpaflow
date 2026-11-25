# Contributing to GPAFlow 💙

Thanks for your interest in contributing to GPAFlow! Whether it's a bug fix, new feature, or improvement every contribution matters.

## Getting Started

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/fahadshahbaz/Gpaflow.git
   cd gpaflow
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`.

4. **Start the dev server:**
   ```bash
   pnpm dev
   ```

## Making Changes

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

   Use branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`.

2. **Make your changes** and test locally.

3. **Run lint checks** before committing:

   ```bash
   pnpm lint
   ```

4. **Commit with clear messages:**

   ```
   feat: add semester comparison chart
   fix: resolve grade calculation for edge cases
   docs: update README with new setup steps
   ```

5. **Push and open a PR** against the `main` branch.

## Pull Request Guidelines

- Keep PRs **focused** - one feature or fix per PR.
- Include a **clear description** of what your PR does and why.
- Add **screenshots** if your change affects the UI.
- Make sure the build passes (`pnpm build`).
- Link any related **issues** in the PR description.

## Code Style

- We use **BiomeJS** for linting and formatting. Run `pnpm lint` to check.
- Use **TypeScript** with proper types - avoid `any`.
- Follow the existing **component patterns** in the codebase.
- Use the design tokens defined in `globals.css` - don't hardcode colors.

## Project Structure

```
app/                  # Next.js App Router pages & layouts
├── (auth)/           # Auth pages (login, signup, etc.)
├── dashboard/        # Dashboard pages (overview, semesters, settings)
├── onboarding/       # University selection
components/
├── dashboard/        # Dashboard-specific components
├── ui/               # Shared UI components (Button, Input, etc.)
lib/
├── grading/          # Grading engine (Strategy Pattern)
├── supabase/         # Supabase client, auth, queries, mutations
types/                # TypeScript type definitions
```

## Reporting Bugs

Open an [issue](https://github.com/fahadshahbaz/Gpaflow/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and device info

## Feature Requests

Have an idea? Open an issue with the `enhancement` label and describe:

- The problem it solves
- How you envision it working
- Any UI mockups or references

## 🎓 Adding University Support

We're actively looking for contributors to add grading engines for more universities! GPAFlow uses a **Strategy Pattern**, each university has its own grading engine file.

**To add a new university:**

1. Create a new grading engine in `lib/grading/` (e.g., `lib/grading/your-uni.ts`)
2. Implement the `GradingEngine` interface from `types/grading.ts`
3. Add the university slug and metadata to `UNIVERSITIES` in `types/grading.ts`
4. Register it in `lib/grading/index.ts`
5. Add it to the onboarding selection screen

Look at `lib/grading/numl.ts` or `lib/grading/gcwuf.ts` as reference implementations.

**Currently supported:**

- ✅ NUML (National University of Modern Languages)
- ✅ GCWUF (GC University for Women Faisalabad)

If your university uses a different grading policy, open a PR or an issue - we'd love to support it!

---

Thank you for helping make GPAFlow better! 🚀
