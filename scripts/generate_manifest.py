#!/usr/bin/env python3
"""Generate a sorted image manifest for the photo carousel."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


def build_manifest(photos_dir: Path) -> dict:
    images = sorted(
        file.name
        for file in photos_dir.iterdir()
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS
    )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "images": images,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--photos-dir",
        type=Path,
        default=Path("photos"),
        help="Directory containing contributed photos.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional output file path. Defaults to <photos-dir>/manifest.json",
    )
    args = parser.parse_args()

    photos_dir = args.photos_dir
    photos_dir.mkdir(parents=True, exist_ok=True)

    output = args.output or photos_dir / "manifest.json"
    manifest = build_manifest(photos_dir)

    output.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(manifest['images'])} images to {output}")


if __name__ == "__main__":
    main()
