# Style and Conventions

This project has a detailed guide for naming conventions and code style.

## Naming Conventions

A detailed guide can be found in `doc/.claude-naming-rules.md`. The key rules are:

* **Folders & App Router Files:** `kebab-case` (e.g., `user-settings`, `index.tsx`)
* **Main React Components:** `PascalCase` (e.g., `UserProfile.tsx`)
* **UI/Utility Components:** `kebab-case` (e.g., `button.tsx`)
* **Hooks:** `camelCase` (e.g., `useUserData.ts`)
* **Utils/Lib/Types:** `kebab-case` (e.g., `format-date.ts`)

## Code Formatting

* **Prettier:** The project uses Prettier for code formatting. The configuration is in `.prettierrc`.
  * `printWidth`: 100
  * `singleQuote`: true
  * `semi`: true
  * `trailingComma`: "es5"

## Linting

* **ESLint:** The project uses ESLint with the `eslint-config-expo` configuration.

## TypeScript

* **Strict Mode:** `strict` is set to `true` in `tsconfig.json`.
* **Path Aliases:** The path alias `@/*` is configured to point to `src/*`.
