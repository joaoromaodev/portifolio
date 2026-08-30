# Project screenshots

Drop screenshots here (one folder per project) and point a project's `image`
and `gallery` fields at them from the admin panel at `/admin`.

## Format: commit lossless WebP, not PNG

Vercel's image optimizer is metered — on the Hobby plan the quota runs out and
`/_next/image` returns 402, which blanks every image on the site. So
optimization is **off** (`images.unoptimized` in `next.config.ts`) and these
files are served exactly as committed.

That makes the source format matter. Convert before committing:

```bash
node -e "const s=require('sharp');s('shot.png').webp({lossless:true,effort:6}).toFile('shot.webp')"
```

Lossless WebP is both smaller than PNG and pixel-identical — for flat UI
screenshots it typically saves 60–70% (the Balcão gallery went 836KB → 368KB).
For an animated GIF, use `s('demo.gif',{animated:true}).webp({quality:80})`.

## Rules

- **16:9-ish** works best — thumbnails crop to 16:10, the card to 16:9.
- ~1440x900 is plenty. Don't commit anything above 2x display size.
- **Government screenshots must use fictional or blurred data** (CLAUDE.md §8).
  Never real values, internal DNS/IPs, or people's names.
- Always fill in the alt text — it's what screen readers announce, and the
  admin panel flags gallery images that are missing it.
