# Contributing to three-iges-loader

Thank you for your interest in this project. Contributions — code, tests, docs, fixtures, and bug reports — are welcome.

## Quick start

```bash
git clone https://github.com/KonseptDesign/three-iges-loader.git
cd three-iges-loader
pnpm install
pnpm test
pnpm dev:example   # optional: visual check at http://localhost:3000
```

**Requirements:** Node.js ≥ 24 (LTS), pnpm 10+ (see `packageManager` in `package.json`).

## What to work on

See [docs/ROADMAP.md](docs/ROADMAP.md) for planned entity types and phases. **Phase B** (wireframe / curves) is the current focus; surfaces and B-rep are deferred unless discussed first.

## Branch strategy

| Branch | Purpose |
|--------|---------|
| **`dev`** | Day-to-day development. Open PRs here. Dependabot targets this branch. |
| **`main`** | Release line only. Merge `dev` → `main` when you are ready to ship. CI + npm publish run on `main`. |

**Contributors:** branch from `dev`, open PRs against `dev`, add a changeset for user-facing changes.

**Maintainers:** when releasing, merge `dev` → `main`. Changesets opens **Version Packages** PRs against `dev`; after merging that, merge `dev` → `main` to trigger npm publish.

## Development workflow

1. **Fork** the repo (or branch in-repo if you are a maintainer).
2. **Create a branch** from `dev`: `feat/type-102-composite-curve`, `fix/de-sequence-parse`, etc.
3. **Make focused changes** — one entity type or one logical fix per PR when possible.
4. **Add tests** — place IGES fixtures in `test/fixtures/` (80-column lines; see [test/fixtures/README.md](test/fixtures/README.md)).
5. **Run checks** before opening a PR:

   ```bash
   pnpm type-check
   pnpm lint
   pnpm format:check   # or pnpm format to fix
   pnpm test
   ```

6. **Add a changeset** (required for changes that affect the published package):

   ```bash
   pnpm changeset
   ```

   Choose `patch` / `minor` / `major` per [Semantic Versioning](https://semver.org/). Describe the user-facing impact.

7. **Open a pull request** against `dev` with a clear description and link any related issues.

## Architecture (where to edit)

| Change | Location |
|--------|----------|
| IGES parsing | `packages/iges-core/` |
| New entity type | `packages/iges-core/src/entities/decoders/` + [docs/ENTITY_IMPLEMENTATION.md](docs/ENTITY_IMPLEMENTATION.md) |
| Three.js output | `src/three/toThree.ts` |
| Public loader API | `src/IGESLoader.ts`, `src/index.ts` |

Full overview: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## AI-assisted contributions

If you use Cursor, Copilot, or other agents, read [AGENTS.md](AGENTS.md) first. It lists constraints (e.g. no `three` in `iges-core`, no surface entities without approval) so automated edits stay aligned with the project.

## Pull request expectations

- CI must pass (typecheck, lint, format, test, build).
- User-visible changes include a **changeset** (maintainers will ask you to add one if missing).
- No unrelated drive-by refactors.
- Update docs when you add entity support or change public API.

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml). Attach a minimal `.iges` / `.igs` file when possible (or redacted excerpt) and your Three.js version.

## Security

See [SECURITY.md](SECURITY.md) for responsible disclosure.

## Releases (maintainers)

Publishing is automated via Changesets — see [RELEASING.md](RELEASING.md). Contributors do not need to publish to npm manually.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Please be respectful and constructive.

## Questions

Open a [GitHub Discussion](https://github.com/KonseptDesign/three-iges-loader/discussions) or an issue labeled `question` if you are unsure where to start.
