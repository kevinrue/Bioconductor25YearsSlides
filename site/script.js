const imageElement = document.getElementById("carousel-image");
const filenameElement = document.getElementById("filename");
const fsFilenameElement = document.getElementById("fs-filename");
const statusElement = document.getElementById("status");
const counterElement = document.getElementById("counter");
const contributeLink = document.getElementById("contribute-link");
const previousButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const fullscreenButton = document.getElementById("fullscreen-btn");
const pauseButton = document.getElementById("pause-btn");
const progressFill = document.getElementById("progress-fill");
const carouselElement = document.querySelector(".carousel");
const REPOSITORY_URL = "https://github.com/kevinrue/Bioconductor25YearsSlides";

const ROTATION_MS = 10000;

let images = [];
let activeIndex = 0;
let rotationTimer = null;
let timerStartedAt = null;
let pausedElapsed = 0;
let isPaused = false;
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
  fsFilenameElement.textContent = fileName;
  counterElement.textContent = `${activeIndex + 1} / ${images.length}`;
  restartProgress();
}

function restartProgress() {
  progressFill.style.animation = "none";
  progressFill.offsetHeight; // force reflow to restart animation
  progressFill.style.animation = `progress-advance ${ROTATION_MS}ms linear forwards`;
  if (isPaused) {
    progressFill.style.animationPlayState = "paused";
  }
}

function advance(step) {
  showImage(activeIndex + step);
}

function resetRotation() {
  if (rotationTimer !== null) {
    window.clearTimeout(rotationTimer);
    rotationTimer = null;
  }
  timerStartedAt = Date.now();
  pausedElapsed = 0;
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
  if (isPaused) {
    pausedElapsed = 0;
  } else {
    resetRotation();
  }
});

nextButton.addEventListener("click", () => {
  advance(1);
  if (isPaused) {
    pausedElapsed = 0;
  } else {
    resetRotation();
  }
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  if (isPaused) {
    pausedElapsed = timerStartedAt !== null ? Date.now() - timerStartedAt : 0;
    window.clearTimeout(rotationTimer);
    rotationTimer = null;
    progressFill.style.animationPlayState = "paused";
    pauseButton.textContent = "Resume";
    pauseButton.setAttribute("aria-label", "Resume presentation");
  } else {
    pauseButton.textContent = "Pause";
    pauseButton.setAttribute("aria-label", "Pause presentation");
    const remaining = Math.max(0, ROTATION_MS - pausedElapsed);
    timerStartedAt = Date.now() - pausedElapsed;
    progressFill.style.animationPlayState = "running";
    rotationTimer = window.setTimeout(() => {
      rotationTimer = null;
      advance(1);
      resetRotation();
    }, remaining);
  }
});

function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

fullscreenButton.addEventListener("click", async () => {
  if (!isFullscreen()) {
    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
      statusElement.textContent = "Fullscreen is not supported in this browser or context.";
      return;
    }
    try {
      if (carouselElement.requestFullscreen) {
        await carouselElement.requestFullscreen();
      } else if (carouselElement.webkitRequestFullscreen) {
        carouselElement.webkitRequestFullscreen();
      }
    } catch (err) {
      statusElement.textContent = `Fullscreen unavailable: ${err.message}`;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

function onFullscreenChange() {
  const full = isFullscreen();
  carouselElement.classList.toggle("fullscreen-active", full);
  fullscreenButton.textContent = full ? "Exit fullscreen" : "Fullscreen";
  fullscreenButton.setAttribute("aria-label", full ? "Exit fullscreen" : "Enter fullscreen");
  if (full) restartProgress();
}

document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);

setContributeLink();
loadManifest();
