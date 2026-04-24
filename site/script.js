const imageElement = document.getElementById("carousel-image");
const filenameElement = document.getElementById("filename");
const statusElement = document.getElementById("status");
const counterElement = document.getElementById("counter");
const contributeLink = document.getElementById("contribute-link");
const previousButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const REPOSITORY_URL = "https://github.com/kevinrue/Bioconductor25YearsSlides";

const ROTATION_MS = 10000;

let images = [];
let activeIndex = 0;
let rotationTimer = null;
let photosBasePath = "photos";

function setContributeLink() {
  contributeLink.href = REPOSITORY_URL;
}

function showImage(index) {
  if (!images.length) {
    return;
  }

  activeIndex = (index + images.length) % images.length;
  const fileName = images[activeIndex];

  imageElement.src = `${photosBasePath}/${encodeURIComponent(fileName)}`;
  imageElement.alt = `Contributed photo ${fileName}`;
  filenameElement.textContent = fileName;
  counterElement.textContent = `${activeIndex + 1} / ${images.length}`;
}

function advance(step) {
  showImage(activeIndex + step);
}

function resetRotation() {
  if (rotationTimer) {
    window.clearInterval(rotationTimer);
  }
  rotationTimer = window.setInterval(() => advance(1), ROTATION_MS);
}

async function loadManifest() {
  try {
    const manifestCandidates = ["photos/manifest.json", "../photos/manifest.json"];
    let response = null;

    for (const manifestPath of manifestCandidates) {
      const candidateResponse = await fetch(manifestPath, { cache: "no-store" });
      if (candidateResponse.ok) {
        response = candidateResponse;
        photosBasePath = manifestPath.replace("/manifest.json", "");
        break;
      }
    }

    if (!response) {
      throw new Error("Could not load manifest (HTTP 404)");
    }

    const manifest = await response.json();
    if (!Array.isArray(manifest.images)) {
      throw new Error("Manifest format is invalid");
    }

    images = [...manifest.images].sort((a, b) => a.localeCompare(b));

    if (!images.length) {
      statusElement.textContent = "No photos yet. Submit a pull request to add one.";
      return;
    }

    statusElement.textContent = "";
    showImage(0);
    resetRotation();
  } catch (error) {
    statusElement.textContent = `Unable to load photos: ${error.message}`;
  }
}

previousButton.addEventListener("click", () => {
  advance(-1);
  resetRotation();
});

nextButton.addEventListener("click", () => {
  advance(1);
  resetRotation();
});

setContributeLink();
loadManifest();
