# Chloe Lee: record wall portfolio

A living-room wall: name and a fun fact on the left, a TV showing what's playing now and up next, and a wall of records (one per place I've worked) with liner notes that change as you hover or tap.

Built with React, TypeScript and Vite. No UI libraries, just one stylesheet.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

## Editing content

Almost everything lives in `src/data.ts`:

- `records`: each sleeve on the wall (name, role, the 'tracks' listed in its liner notes, placeholder colour). `format: 'lp'` is a 12-inch sleeve for roles and `'single'` is a 7-inch for projects.
- `defaultRecordId`: which record is pulled out when the page loads.
- `funFacts`: the lines the fun fact reel spins through (keep each to a few words).
- `tv`: city, time zone for the clock, now playing and up next.
- `contact`: the line on the floor (the sentence, then the "say hi" link) and the email it opens.

## Adding album covers

1. Put the image in `public/covers/`, e.g. `public/covers/amazon.jpg` (square, about 600×600).
2. In `src/data.ts`, add `cover: 'covers/amazon.jpg'` to that record. Add `album: { title: 'Melodrama', artist: 'Lorde' }` to show "inspired by…" in the liner notes.

The cover replaces the coloured placeholder and tape label on the sleeve, and the TV thumbnail. All nine covers are already in `public/covers/`.

## Where things are

- `src/App.tsx`: page layout
- `src/components/RecordWall.tsx`: sleeves, slide-out records, liner notes
- `src/components/Tv.tsx`: Toronto skyline, live clock, now playing / up next
- `src/components/FunFact.tsx`: the rolling fun fact
- `src/components/Furniture.tsx`: turntable table and loveseat
- `src/styles.css`: all styles; colours are CSS variables at the top

## Deploying

It's a static site, so any static host works. On Vercel or Netlify, import the repo and use `npm run build` with `dist` as the output folder.
