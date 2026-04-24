# Bioconductor25YearsSlides

Carousel of slides to celebrate 25 years of the Bioconductor project.

## Repository Purpose

This repository hosts:

- a `photos/` folder where contributors add images through pull requests
- a GitHub Pages site with a rotating photo carousel
- a contribution banner at the top of the page that points people to pull requests

Photos are displayed in alphabetical filename order. Contributors can control placement in the sequence by naming files accordingly (for example `YYYY-MM-DD-topic.jpg`).

## Structure

- `photos/`: contributed images and generated `manifest.json`
- `site/`: static frontend (`index.html`, `styles.css`, `script.js`)
- `scripts/generate_manifest.py`: builds sorted image manifest
- `scripts/check_images.py`: validates image dimensions and file size
- `.github/workflows/deploy-pages.yml`: deploys site to GitHub Pages
- `.github/workflows/check-images.yml`: enforces image constraints on pull requests

## Contributing Photos

1. Add one or more image files to `photos/`.
2. Keep filenames meaningful and sortable (alphabetical order controls carousel order).
3. Open a pull request.

The PR workflow checks each image against default limits:

- max width: `5000` px
- max height: `5000` px
- max file size: `10,000,000` bytes

If needed, adjust thresholds in `.github/workflows/check-images.yml`.

## Local Preview

Generate the local manifest and run a simple static web server.

### 1) Generate `photos/manifest.json`

```bash
python scripts/generate_manifest.py --photos-dir photos
```

### 2) Serve the site

From the repository root:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/site/`

## GitHub Pages Deployment

On pushes to `main`, the deploy workflow:

1. Regenerates `photos/manifest.json`
2. Bundles `site/` plus `photos/` into a `dist/` artifact
3. Deploys to GitHub Pages

After enabling Pages in repository settings, your live carousel will update automatically on new pushes.
