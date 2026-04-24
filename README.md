# Bioconductor 25 Years – Photo Carousel

A community-driven slideshow celebrating 25 years of the
[Bioconductor](https://bioconductor.org) project, deployed to GitHub Pages.

🌐 **Live carousel:** <https://kevinrue.github.io/Bioconductor25YearsSlides/>

## How to contribute a photo

1. **Fork** this repository.
2. **Add** your photo to the `photos/` folder — see
   [`photos/README.md`](photos/README.md) for naming conventions and file
   requirements.
3. **Open a pull request.**
   An automated check will verify that your photo meets the size limits.
4. Once merged, the carousel updates automatically via GitHub Actions.

## Photo requirements

| Limit | Value |
|-------|-------|
| File size | ≤ 5 MB |
| Maximum dimension (width **or** height) | ≤ 3 000 px |

Supported formats: `.jpg` / `.jpeg`, `.png`, `.gif`, `.webp`

## Repository structure

```
photos/          ← contributor photos (alphabetical = display order)
index.html       ← carousel page (static; deployed to GitHub Pages)
.github/
  workflows/
    deploy.yml        ← builds & deploys the site on every push to main
    check-photos.yml  ← validates photo size on every pull request
```

## Local preview

Open `index.html` in a browser **via a local web server** (required because
the page fetches `photos.json`):

```bash
python3 -m http.server          # then open http://localhost:8000
```
