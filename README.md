# e-OPD

Frontend foundation for the e-OPD outpatient management application, built with
React, TypeScript, Vite, and Tailwind CSS.

The public landing page uses the original e-OPD content, hospital photograph,
hospital logo, typography, colors, and responsive layout.

## Requirements

- Node.js 20.19+ on the 20.x release line, or Node.js 22.12 and newer.
- npm (included with Node.js).

This project was verified with Node.js 24.11.1 and npm 11.6.2.

## Get started

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Check TypeScript and create a production build in `dist/`. |
| `npm run lint` | Check the source with Oxlint and React rules. |
| `npm run preview` | Serve the production build locally after building. |

## Project structure

```text
public/             Static assets served directly, including the favicon
src/
  assets/           Original hospital photograph and logo
  components/       Hospital branding, public navigation, and shared controls
  pages/            Public landing page
  App.tsx           Page entry point and unavailable-page notice
  App.css           Public header, controls, and responsive styles
  index.css         Tailwind import, shared styles, and color tokens
  main.tsx          React entry point
index.html          HTML entry point and page metadata
vite.config.ts      Vite configuration
tsconfig*.json      TypeScript configuration
.oxlintrc.json      Lint configuration
```

## Current scope

The landing page includes the hospital introduction, patient services,
appointment steps, visit preparation, and footer. Section links and the mobile
menu work. Sign-in, registration, FAQ, and legal controls open an explicit
unavailable-page notice until those pages are implemented.

Authentication, routing, patient management, APIs, and database storage have
not been added. This module does not make requests to the original application's
backend or store patient information. No database migration is needed.

The Manrope font loads from Google Fonts, with system fonts as a fallback.

Keep secrets out of frontend code. Vite variables prefixed with `VITE_` are
included in the browser bundle and must never contain private credentials.

`node_modules/`, `dist/`, and local environment files are ignored by Git.
Commit `package-lock.json` with dependency changes; use `npm ci` for clean,
reproducible installs.
