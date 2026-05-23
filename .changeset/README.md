# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

## Contributors

After making a **user-visible** change to `three-iges-loader`:

```bash
pnpm changeset
```

- Choose **patch** / **minor** / **major**
- Write a short summary (appears in `CHANGELOG.md` and GitHub releases)
- Commit the generated `.md` file in this folder with your PR

`iges-core` is a private workspace package and is **ignored** by Changesets until we publish it separately.

## Maintainers

See [RELEASING.md](../RELEASING.md) and [docs/GITHUB_SETUP.md](../docs/GITHUB_SETUP.md).
