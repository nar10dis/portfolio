# portfoliov2

Interactive map portfolio. A background map (`map.png`) is covered with clickable
icons; each icon opens a side panel describing one experience (title, date,
description, text, skills, image or scrolling image gallery).

## Run

Static site, no build step. From the project root:

```sh
python3 -m http.server
```

Then open <http://localhost:8000>. Opening `index.html` as `file://` does not
work: the panel texts are loaded with `fetch`.

## Layout

| File / dir        | Role |
|-------------------|------|
| `index.html`      | Page skeleton. Loads `css/style.css` and the scripts in `js/`, in order. |
| `js/points.js`    | Data: the `points` array, one entry per place on the map. |
| `js/panneau.js`   | Side panel: `ouvrePanneau(point)`, scrolling gallery, zoom-in view (`#loupe`). |
| `js/lieux.js`     | Puts one symbol per point on the map with its name below, click opens the panel. |
| `js/bateau.js`    | Animated boats sailing from a screen edge to an anchorage and back. |
| `js/rhumbs.js`    | Rhumb lines drawn in SVG. |
| `js/regions.js`   | Hovering a region writes its name in the frame on the left. |
| `css/style.css`   | Layout. The map is rotated 90° (`#carte`); points are positioned in % over it. |
| `images/`         | Map, coast hatching, page background. |
| `public/symboles/` | Place symbols, from the Myer Settlement Brushes (CC0). |
| `public/contenu/`  | Per-point image + `.txt` panel text. `public/contenu/dessins/mini/` holds the gallery thumbnails. A line holding only a `https://` URL becomes a link. |
| `sources/`        | Not part of the site (brush file, old assets). Not versioned. |

## Adding or editing a point

Add an entry to the `points` array in `js/points.js`:

```js
{ id: 15, x: 50, y: 50, name: "Title", icon: "public/symboles/myer-92.png", niveau: 3,
  description: "Short line.", image: "public/contenu/foo.jpg",
  date: "2026", text: "public/contenu/foo.txt",
  skills: ["Skill A", "Skill B"] },
```

- `x`, `y`: position in % of the `#points` overlay.
- `niveau`: symbol size, 1 = city, 2 = town, 3 = house / mill.
- Use `images: [...]` instead of `image` for an auto-scrolling gallery.
