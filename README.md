# kritikmodi.com

My personal site. Hand-built with plain **HTML, CSS and JavaScript** — no
framework, no build step, no dependencies.

## Design

The direction is "schematic": the site is laid out like an instrument panel
rather than a portfolio template.

- **Ground** — a cool vellum grey (`#EAEDEB`) over a faint 26px dot grid, with
  one inverted ink band for the record section.
- **Signal** — a single electric ultramarine (`#2B45F0`) carries every accent.
  Nothing else is coloured.
- **Type** — Martian Mono for display (set large, lowercase, tightly tracked),
  Instrument Sans for prose, JetBrains Mono for labels and figures.
- **Signature** — the hero is an interactive diagram of the platform the work
  actually describes: clouds → private network → orchestrator / compute →
  **query engine** → retrieval / signals / storage. The query engine is drawn
  larger because it is the largest piece of the job, so the size carries
  information. Edges draw themselves in on load, a single packet crosses one
  hop every few seconds, and picking a node lights its path and writes a line
  about that layer.

## Run it locally

Serve over HTTP so the root-relative paths and web fonts resolve:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
index.html             # home: hero + schematic, about, work, record, contact
writing/index.html     # the queue of pieces, with an honest status on each
photography/index.html # a 35mm contact sheet, still empty
assets/css/styles.css  # tokens, layout, the schematic
assets/js/main.js      # menu, reading progress, clock, reveals, schematic
assets/Kritik_Modi_Resume.pdf
```

## Adding to it

- **Photography** — replace the empty `.cell` frames in
  `photography/index.html` with real `<img>` tags; the frame numbers can stay
  as captions.
- **Writing** — as pieces go live, turn `.queue__item` entries into links and
  drop the status label.
- **The schematic** — nodes carry their own copy in `data-caption` and their
  wiring in the edges' `data-from` / `data-to`. Move a node's `cx`/`cy` and the
  lines re-trim themselves at runtime.

Motion is skipped entirely under `prefers-reduced-motion`, and the diagram's
resting state is the finished drawing, so nothing depends on JavaScript to be
visible.

Deployed on Netlify at **https://kritikmodi.com**.
