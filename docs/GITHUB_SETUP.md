# GitHub & npm setup (maintainers)

## npm Trusted Publishing (required for CI publish)

This repo publishes with **[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)** (OIDC). You do **not** need an `NPM_TOKEN` GitHub secret.

### One-time setup on npmjs.com

1. Open [three-iges-loader on npm](https://www.npmjs.com/package/three-iges-loader) → **Settings** → **Trusted publishing** → **Add publisher** → **GitHub Actions**
2. Set fields **exactly** (case-sensitive):

   | npm field | Value |
   |-----------|--------|
   | Organization or user | `KonseptDesign` |
   | Repository | `three-iges-loader` |
   | Workflow filename | `publish.yml` |
   | Allowed actions | **`npm publish`** |
   | Environment name | *(leave empty)* |

3. **`package.json` → `repository.url`** must match the GitHub repo (`git+https://github.com/KonseptDesign/three-iges-loader.git`). If the org or repo is renamed, update npm and `repository` together.

4. On GitHub: **Settings → Actions → General**
   - Workflow permissions: **Read and write**
   - **Allow GitHub Actions to create and approve pull requests** ✅

5. Optional: remove any old **`NPM_TOKEN`** secret from the repo. After the first successful OIDC publish, you can tighten npm **Publishing access** to *Require 2FA and disallow tokens*.

### What the publish workflow does

Every push to **`main`** runs [`.github/workflows/publish.yml`](../.github/workflows/publish.yml):

| Situation | What happens |
|-----------|----------------|
| There are files in `.changeset/` | Opens or updates a **“Version Packages”** PR (bumps version + `CHANGELOG.md`). **No publish yet.** |
| There are **no** pending changesets (typically right after you merge that Version PR) | Runs **`npm publish --access public`**. npm verifies the job against your trusted publisher config and uploads the package (with provenance). |

So you will **not** see a separate `run: npm publish` step in the YAML list — the [Changesets action](https://github.com/changesets/action) runs it for you via its `publish:` input when it is time to release. On npm, the allowed action **`npm publish`** still matches that command.

Build and tests run automatically via **`prepublishOnly`** in `package.json` before `npm publish`.

### Workflow requirements (already in `publish.yml`)

| Requirement | Why |
|-------------|-----|
| `permissions.id-token: write` | GitHub issues the OIDC token npm checks |
| `setup-node` with `registry-url: https://registry.npmjs.org` | npm CLI knows which registry to use |
| Node **24** on the publish job | Bundled npm supports Trusted Publishing (≥ 11.5.1 per npm docs) |
| `runs-on: ubuntu-latest` | GitHub-hosted runners only (per npm docs) |
| `cache: false` on the publish job | npm release guidance for publish jobs |

## Workflows

| File | Role |
|------|------|
| `.github/workflows/ci.yml` | PR/push checks |
| `.github/workflows/publish.yml` | Changesets Version PR + npm publish |

## Branch protection (recommended)

On `main`: require **CI / Test & build** before merge.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Version PR never opens | A `.changeset/*.md` file merged to `main`? Workflow enabled on `main`? |
| `ENEEDAUTH` / 401 on publish | Trusted publisher: workflow **`publish.yml`**, org/repo spelling, **Allowed actions** includes `npm publish` |
| Publish runs but wrong version | Merge the **Version Packages** PR first so `package.json` is bumped |
| [npm troubleshooting](https://docs.npmjs.com/trusted-publishers#troubleshooting) | Official OIDC checklist |
