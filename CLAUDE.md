# Finance App Agent Notes

## Start Here

- Read [OVERVIEW.md](OVERVIEW.md) before making structural changes. It documents the product flow, route map, and existing architecture.
- Use Bun by default. The repo commits `bun.lock`, and the verified lint path is `bun run lint`.
- Main commands live in [package.json](package.json): `bun install`, `bun run start`, `bun run android`, `bun run ios`, `bun run web`, `bun run lint`.
- There is no test suite yet and no `test` script.

## Architecture Decisions

- Keep the codebase feature-based, not layer-based. Domain code belongs in `src/features/*` so each feature can evolve its own hooks, services, types, and data mapping together.
- Keep routes in `app/*`, shared UI in `src/components/*`, cross-cutting utilities in `src/lib/*`, and app-wide state in `src/stores/*`.
- Use Expo Router, not raw React Navigation. The app already models navigation through file-based routes, route groups, and root layouts in `app/`.
- Use Zustand for lightweight global state. Persisted auth, onboarding flow, and selected month state already live there without provider boilerplate.
- Use React Query for server state. Do not move API caching or request lifecycle state into Zustand, Context, or Redux.
- Prefer Bun over npm/yarn for dependency work because the committed lockfile is `bun.lock` and it keeps installs aligned with the repo.

## Non-Obvious Constraints

- Treat features as islands. Do not add new direct imports from `src/features/X` into `src/features/Y`.
- If multiple features need the same type, mapper, or helper, extract it to a shared location such as `src/lib/*` instead of coupling features together.
- Current code still has legacy cross-feature imports between `saldos` and `transactions`. Do not copy that pattern into new code.
- Style with NativeWind/Tailwind utility classes via `className`. Do not introduce new `StyleSheet.create()` blocks.
- Legacy exception: [src/components/ui/FABButton.tsx](src/components/ui/FABButton.tsx) still uses `StyleSheet.create()`.
- Do not use `fetch`. Route HTTP calls through the centralized Axios client in [src/services/client.ts](src/services/client.ts) and keep request code inside feature services.
- Keep environment access centralized and typed with Expo env support from [expo-env.d.ts](expo-env.d.ts). Do not spread new direct `process.env` reads through feature code.
- Legacy exception: [src/services/client.ts](src/services/client.ts) currently reads `EXPO_PUBLIC_API_URL` directly.

## What Not To Do

- Do not create a component in `src/components/*` if it is only used by one feature. Keep it inside that feature.
- Do not use `any` in TypeScript. If the type is unknown, use `unknown` and narrow it.
- Do not couple business logic to navigation calls. Keep navigation in event handlers; keep rules in hooks, stores, or services.
- Do not add native libraries without checking compatibility with the current Expo SDK in [package.json](package.json).

## Validation Expectations

- No automated tests exist yet. Do not invent test commands or claim test coverage.
- Validate with the smallest relevant command first, usually `bun run lint`, or with focused manual verification on the touched route/component.

## Key Anchors

- Routing and app bootstrap: [app/_layout.tsx](app/_layout.tsx)
- Auth persistence and hydration: [src/stores/useAuthStore.ts](src/stores/useAuthStore.ts)
- Month navigation state: [src/stores/useDateStore.ts](src/stores/useDateStore.ts)
- Central HTTP client: [src/services/client.ts](src/services/client.ts)