# Carousely

Carousely is a static, AI-ready LinkedIn carousel studio built with HTML, CSS and Vanilla JavaScript. It turns a topic or pasted content into a semantic slide structure, applies one of 20 configuration-driven design systems, supports personal Brand Kits, provides a direct-manipulation editor, scores quality, and exports PNG, PDF or editable PowerPoint.

## Features

- Local deterministic content and hook generation; no API key required
- 20 premium design systems with differentiated ornaments and compositions
- Six common canvas formats with an in-app size masterclass and safe object resizing
- English LTR and Arabic RTL editing
- Canonical project, slide and element data model
- Direct text editing, pointer drag, resize, z-order, lock, duplicate and delete
- Slide add, duplicate, delete and drag-to-reorder
- Project dashboard, filters, favorites and local persistence
- Brand Kit manager and global color controls
- Structured bar charts and Excel/CSV import
- Deterministic quality scoring with actionable slide navigation
- PNG/ZIP, PDF and native-object PPTX export
- Responsive dashboard and drawer-based mobile editor panels
- Automatic canvas fitting and touch-friendly layouts for 360, 390, 430, 768, 1024 px and desktop viewports
- Undo/redo history and debounced autosave

## Technology

The runtime is static HTML5, CSS3 and browser-native ES modules. Specialized browser libraries are loaded through CDN: html-to-image, jsPDF, JSZip, PptxGenJS and SheetJS. There is no framework, backend, package manager, bundler or build step.

## File Structure

```text
index.html
css/                 design tokens, base, components, editor, responsive
js/
  app.js             routing, screens and interaction controller
  config.js          global product configuration
  models/            canonical project model
  templates/         design-system configurations
  editor/            slide/model renderer
  services/          local AI and provider abstractions
  repositories/      persistence boundaries
  quality/           deterministic scoring
  exports/           PNG, PDF and editable PPTX exporters
```

## How to Run

Opening `index.html` works in browsers that permit local ES modules. A static server is recommended:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages Deployment

Publish the repository root from the `main` branch in **Settings → Pages**. All application paths are relative and hash routing requires no server rewrite rules.

## PowerPoint Export Architecture

The PPTX exporter consumes the canonical project model. Text maps to `addText`, shapes to `addShape`, images to `addImage`, and supported chart data to native `addChart`. Coordinates are converted from the 1080 × 1350 logical canvas to a custom 10 × 12.5 inch PowerPoint layout. Slides are not flattened into full-page screenshots.

Fonts are not embedded. The fonts listed in the export dialog must be installed on the computer opening the file. Browser-only decorative effects and some CSS typography can be simplified by PowerPoint; text, supported shapes and basic charts stay editable.

## Persistence

Repositories isolate browser storage from UI code. Projects, Brand Kits and settings are stored in localStorage. Uploaded images are limited to 5 MB to reduce quota risk. A production deployment can replace the repository with IndexedDB without changing editor consumers.

## Optional AI Integration

AI calls are centralized in `js/services/ai.js`. Provider settings live in `APP_CONFIG` in `js/config.js`. The included provider is deterministic and local. Translation and background removal report an honest unavailable state until a provider is configured; no secret is bundled.

## Browser Requirements

Use a current Chrome, Edge, Firefox or Safari release with ES modules, `structuredClone`, FileReader, Canvas and Blob support. Internet access is required for CDN libraries and web fonts unless they are hosted locally.

## Known Limitations

- LocalStorage is device/browser-specific and is not cloud synchronization.
- Spreadsheet import currently accepts a first-column-label / second-column-number workflow.
- PowerPoint may substitute fonts not installed on the destination device.
- Translation, background removal and external generative AI require a configured provider.
- Some CSS-only ornaments are not reproduced in PPTX; supported content objects remain editable.
