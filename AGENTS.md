# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.

## Android / APK builds

This app is packaged as an Android APK via Capacitor (`android/` directory, `.github/workflows/build-apk.yml`). **Every APK build must remain installable as an update over the previously installed one** — never ship a build that forces the user to uninstall the app first.

- **Signing key must stay fixed.** `android/app/debug.keystore` is committed to the repo on purpose and wired into `signingConfigs.debug` in `android/app/build.gradle`. Do not delete it, regenerate it, or let a build fall back to an auto-generated debug key (e.g. by removing the `signingConfig` line) — CI runs on a fresh VM each time, so an auto-generated key changes every build and Android refuses to install an APK signed with a different certificate than the one already on the device.
- **`versionCode` must increase on every build**, never stay equal or go down. It's currently derived from `GITHUB_RUN_NUMBER` in CI (see `build.gradle`) — keep that (or an equivalent monotonic scheme) in place.
- **`applicationId`** (`app.moodtracker.figmamake`) must never change — a different id is treated as a completely different app, losing the user's on-device data.
- If you ever switch to a `release` build type or a real Play Store keystore, apply the same rule: generate the signing key once, store/commit it (or a CI secret) so it's reused on every build, and never regenerate it.
