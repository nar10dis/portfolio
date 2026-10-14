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
| `js/zoom.js`      | Zoom and pan (wheel, pinch, drag). |
| `js/rhumbs.js`    | Rhumb lines drawn in SVG. |
| `css/style.css`   | Layout. The map is rotated 90° (`#carte`); points are positioned in % over it. |
| `images/`         | Map, coast hatching, page background. |
| `symboles/`       | Place symbols, from the Myer Settlement Brushes (CC0). |
| `contenu/`        | Per-point image + `.txt` panel text. `contenu/dessins/mini/` holds the gallery thumbnails. |
| `server.js`       | Local Node static server (`node server.js`, port 8080). Not used on GitHub Pages. |
| `sources/`        | Not part of the site (brush file, old assets). Not versioned. |

## Adding or editing a point

Add an entry to the `points` array in `js/points.js`:

```js
{ id: 15, x: 50, y: 50, name: "Title", icon: "symboles/myer-92.png", niveau: 3,
  description: "Short line.", image: "contenu/foo.jpg",
  date: "2026", text: "contenu/foo.txt",
  skills: ["Skill A", "Skill B"] },
```

- `x`, `y`: position in % of the `#points` overlay.
- `niveau`: symbol size, 1 = city, 2 = town, 3 = house / mill.
- Use `images: [...]` instead of `image` for an auto-scrolling gallery.
- To find coordinates: open the browser console and click on the map — every
  click logs `x: .., y: ..` relative to the overlay.

## Known loose ends

- Point 8 (Gamedev) reuses the Airtable image, text and skills (placeholder).
- Point 2 date reads `20021-2026` (typo).
- Several `.txt` files are still placeholder text (`dessin.txt`, ...).
