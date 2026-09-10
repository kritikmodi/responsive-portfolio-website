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
- **Type** — Instrument Serif for the name alone, so the wordmark is the one
  thing on the page that isn't set in a technical face; Martian Mono for
  display, Instrument Sans for prose, JetBrains Mono for labels and figures.
- **Signature** — the hero is an interactive diagram of the work rather than of
  one system, because the job is three things, not one stack. The AI work sits
  on top, then the Datatailr platform (infrastructure → platform → strategies),
  then the query engine (sources → engine → answers); the layout follows the
  same order the bio does. Every structural choice carries information: the two
  products get the larger nodes, every node carries one hard figure so the row
  reads as a readout without hovering, and the AI edges are dashed because
  those features are still being built. Solid edges draw themselves in on load,
  a packet crosses one built hop every few seconds, and picking a node lights
  its path and writes a line about it.

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
  lines re-trim themselves at runtime. `node--hub` marks a node as one of the
  big pieces, `node__figure` is its one-line readout; `edge--new` marks a connection as not built yet, which draws it
  dashed and keeps the packet off it.

Motion is skipped entirely under `prefers-reduced-motion`, and the diagram's
resting state is the finished drawing, so nothing depends on JavaScript to be
visible.

Deployed on Netlify at **https://kritikmodi.com**.
