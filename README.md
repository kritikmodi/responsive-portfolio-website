# kritikmodi.com

My personal site: a warm, minimal, editorial home for the work, the writing,
the photography, and a little of everything else.

Hand-built with plain **HTML, CSS and JavaScript**, no framework, no build step.
Set in *Newsreader*, *Hanken Grotesk* and *IBM Plex Mono*.

## Run it locally

Serve the folder over HTTP (needed so web fonts and the résumé link resolve):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Or, if you have Node:

```bash
npx serve .
```

## Structure

```
index.html            # all page content
assets/css/styles.css # design system + layout
assets/js/main.js     # mobile nav, live clock, scroll reveals
assets/img/           # portrait + a photos/ folder for the gallery
assets/Kritik_Modi_Resume.pdf
```

## Things to personalize

- **Photography**: drop images into `assets/img/photos/` and swap the
  placeholder frames in the `#photography` section for real `<img>` tags.
- **Writing**: the `#writing` section is an honest "coming soon"; replace the
  "On the list" items with real posts as you publish them.
- **Links**: competitive-programming profile URLs in the footer assume the
  handle `kritikmodi`; double-check they point where you want.

Deployed on Netlify at **https://kritikmodi.com**.
