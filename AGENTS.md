# AGENTS.md

## Node.js / npm environment

`node`, `npm`, and `pnpm` are **not** on the default `PATH` on this machine. They are
managed by nvm under `$HOME/.nvm/versions/node`, and nvm's shell initialization is not
sourced by non-interactive shells (agent bash sessions, CI-like contexts).

Before running any node/npm/pnpm command, activate the toolchain with:

```sh
export PATH="$HOME/.nvm/versions/node/$(basename "$(ls -d $HOME/.nvm/versions/node/v24.* | sort -V | tail -1)")/bin:$PATH"
```

This resolves the newest installed Node matching the major version pinned in
`.nvmrc` (currently 24). Note: `source $HOME/.nvm/nvm.sh && nvm use` does **not**
work reliably in non-interactive shells here; use the PATH export above.

- npm is then available as `npm` (ships with the nvm-installed Node).
- pnpm is not installed as a standalone binary. Use `corepack pnpm` — Corepack
  reads the `packageManager` field in `package.json` (pnpm@11.25.0) and uses
  exactly that version.

Package manager commands (from the repo root):

```sh
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm check
corepack pnpm verify:links
corepack pnpm import:discussions
```
