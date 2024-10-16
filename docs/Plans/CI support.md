# CI support (GitHub Actions)

## [GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions) that will be created (when these workflows will be run)

There will be actions for the following [events](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions#events):

### When a PR is created or updated:

The workflows that will be executed will comment about code that broke because of changes you made in your commits in your PRs, not before you. The checks to merge will fail if they were not a result of what you committed in your PR (ignore checks that also failed in the last PR), but they will be optional because it was already broken in the commits before yours.

### When a PR is made to be merged from `unstable` -> `main`

Unlike [when a PR is created or updated](#when-a-pr-is-created-or-updated), all checks must pass, even if it is not your fault. This is to ensure that the main branch remains bug-free.

## [Workflows](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions#workflows) that will be supported

### aero's own unit tests and systems tests

This will run:
- If the SW and AeroSandbox are modified: `npm run testsAll` in the background
- If the SW is modified: `npm run testsSW` in the background
- If the AeroSandbox is modified: `npm run testsSandbox` in the background

### Biome lint

- <https://biomejs.dev/recipes/continuous-integration/#third-party-actions>

### `tsc` checks

- <https://github.com/EPMatt/reviewdog-action-tsc>

> See <https://github.com/marketplace/actions/run-tsc-with-reviewdog#how-do-i-run-the-action-on-multiple-ts-modules>

### `misspell` checks

- <https://github.com/reviewdog/action-misspell>
