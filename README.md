# MahaNiyam prototype

A lightweight, frontend-only demonstration for SIH26130. All records, rules, workflows and outcomes are illustrative. Buttons change local demonstration state; they do not submit applications, upload files, send messages, approve cases or activate government rules.

## Run

From this folder, with Node.js installed:

```sh
npm run dev
```

Open **http://127.0.0.1:5174**. No `npm install`, API key or environment file is required. The Node process only serves static files on localhost; it does not implement application APIs. Set `PORT` to use a different port.

```sh
npm run build
npm run preview
```

The build writes the static application files into `dist/` and adds Netlify deploy helpers (`_redirects` and `_headers`). That directory is ready for drag-and-drop deploys, and the root `netlify.toml` is ready for Git-based Netlify deploys.

## Netlify deploy

Use these settings when importing the folder into Netlify:

- **Base directory:** `MahaNiyam-prototype` if deploying from the parent `SmartIndiaHackathon` folder.
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `22`

For a manual deploy, run `npm run build` and upload the generated `dist/` folder. The prototype is a static frontend: no environment variables, OpenAI key, serverless functions, backend routes or paid API calls are required. The slide assets are deliberately excluded from the app build and local web server.

## Walkthrough

A welcome popup opens on the first visit, explaining navigation and all six workspaces. Start the guided tour to move through the relevant screens with Next/Back, or choose **Explore on my own**. The welcome is remembered in this browser and can be reopened with **Explore the demo** in the sidebar.

1. **Overview:** switch sample units, inspect the profile, see evidence readiness and next actions.
2. **Approval roadmap:** filter approvals, open a source-linked explanation, preview a capacity or storage change, and apply the sample difference to the roadmap.
3. **Evidence vault:** add the prepared water statement, filter records, and open an illustrative document preview.
4. **Officer workspace:** open a case, request a sample clarification, or reserve a demonstration inspection slot.
5. **Policy console:** run the fictional capacity-change rule against sample units, then activate a demo version. This does not change real policy.
6. **Scheme explorer:** filter programme themes, inspect sample eligibility checks, and optionally follow an official external source link.

Search is available in the header (`/` shortcut). The guided demo lives at the bottom of the sidebar. Use **Reset demo** in the footer to clear this app's saved state. Changes are saved only in browser localStorage under `mahaniyam-demo-v1`; there is no login or shared database. Switching unit loads a fresh sample journey for that unit.

## Layout and performance

- Plain HTML, CSS and JavaScript; no framework, package dependencies, paid services, external fonts or runtime API requests.
- System sans-serif typography with no font downloads, generated images or heavy media.
- Native document scrolling, sticky header, fixed desktop navigation and a mobile navigation drawer. Wide tables scroll inside their own containers.
- No scroll listeners, continuous animation loops or polling. Only the active page is mounted; search is debounced.
- Minimal dialog transitions, reduced-motion support, keyboard-visible focus, skip navigation and native modal focus containment.
- Static responses are gzip-compressed and cached in memory; app source files are revalidated while developing.
- Slide images, archives, presentation tooling and screenshots never load with the frontend.

## Files

- `index.html`, `console.css`, `app.js`: the complete frontend.
- `server.mjs`: small local static-file server.
- `build.mjs`: dependency-free frontend build that cleans and prepares `dist/` for Netlify.
- `netlify.toml`: Git deploy configuration for Netlify, including publish directory, fallback routing and basic response headers.
- `assets/` and `licenses/`: earlier font assets retained for reference; the current interface does not load them.
- `slides/`: the five completed slide images, PowerPoint, original slide README, line audit, source links and image prompts. The presentation builder was moved here as `slides/build.mjs` and updated for this location. It uses the existing Codex presentation runtime on this computer and writes a new timestamped PPTX when run.
- `SIH26130_Complete_Slide_Package.zip`: the previously delivered slide archive, moved here unchanged.
- `previews/`: desktop and mobile screenshots from browser checks.

## Validation

Browser checks cover the six routes at 320px, 390px, 768px, 1024px, 1440px, 1920px and 2560px widths; expansion comparison, evidence addition, officer queries, inspection booking, policy preview/activation, search, mobile navigation and reset. The tested flows produced no JavaScript errors, no external network requests and no document-level horizontal overflow. No claim is made that this is a working government service or a legal rules engine.

## Interface revision

The current interface uses a white and neutral-grey foundation, system sans-serif type, blue interaction accents, flat sections with separators and compact square controls. Content adapts to viewport width: desktop side navigation, a mobile drawer, fluid workspace columns, stacked narrow-screen sections and independently scrolling data tables.
