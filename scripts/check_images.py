#!/usr/bin/env python3
"""Validate image dimensions and file size constraints."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, UnidentifiedImageError

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--photos-dir", type=Path, default=Path("photos"))
    parser.add_argument("--max-width", type=int, default=5000)
    parser.add_argument("--max-height", type=int, default=5000)
    parser.add_argument("--max-bytes", type=int, default=10_000_000)
    return parser.parse_args()


def validate_image(path: Path, max_width: int, max_height: int, max_bytes: int) -> list[str]:
    errors: list[str] = []

    file_size = path.stat().st_size
    if file_size > max_bytes:
        errors.append(
            f"{path}: file size {file_size} bytes exceeds limit {max_bytes} bytes"
        )

    try:
        with Image.open(path) as image:
            width, height = image.size
    except UnidentifiedImageError:
        errors.append(f"{path}: file is not a valid image")
        return errors
    except OSError as exc:
        errors.append(f"{path}: could not be read ({exc})")
        return errors

    if width > max_width or height > max_height:
        errors.append(
            f"{path}: dimensions {width}x{height} exceed limit {max_width}x{max_height}"
        )

    return errors


def main() -> int:
    args = parse_args()
    photos_dir: Path = args.photos_dir

    if not photos_dir.exists():
        print(f"No photos directory found at {photos_dir}; skipping checks.")
        return 0

    image_files = sorted(
        file
        for file in photos_dir.iterdir()
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS
    )

    all_errors: list[str] = []
    for file in image_files:
        all_errors.extend(
            validate_image(file, args.max_width, args.max_height, args.max_bytes)
        )

    if all_errors:
        print("Image validation failed:")
        for error in all_errors:
            print(f"- {error}")
        return 1

    print(f"Validated {len(image_files)} image(s) in {photos_dir}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
