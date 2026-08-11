#!/usr/bin/env python3
"""
Predict a handwritten digit from an image using the model created by train.py.

Example:
    python predict.py digit.png
    python predict.py digit.png --model mnist_784_16_16_10.pt

The input may be larger than 28x28. It is converted to grayscale, automatically
inverted when necessary, cropped, resized, and centered in an MNIST-like 28x28
canvas before prediction.
"""

import argparse
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageOps
from torch import nn


class DigitMLP(nn.Module):
    """Must match the architecture used by train.py."""

    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(784, 16),
            nn.ReLU(),
            nn.Linear(16, 16),
            nn.ReLU(),
            nn.Linear(16, 10),
        )

    def forward(self, x):
        return self.network(x)


def preprocess_image(path: Path) -> torch.Tensor:
    """
    Convert a normal handwritten-digit image to an MNIST-like 784-value tensor.

    MNIST uses a dark background with a bright digit. A typical photo/drawing
    uses white paper with dark ink, so this function detects and corrects that.
    """
    image = Image.open(path)
    image = ImageOps.exif_transpose(image).convert("L")
    image = ImageOps.autocontrast(image)

    arr = np.asarray(image, dtype=np.uint8)

    # Estimate the background from the outside border.
    if arr.shape[0] > 1 and arr.shape[1] > 1:
        border = np.concatenate(
            [arr[0, :], arr[-1, :], arr[:, 0], arr[:, -1]]
        )
    else:
        border = arr.ravel()

    # MNIST convention: background near 0, digit near 255.
    if np.median(border) > 127:
        arr = 255 - arr

    # Remove weak background noise and find the digit bounding box.
    threshold = max(20, int(arr.max() * 0.15))
    mask = arr > threshold

    if not mask.any():
        raise ValueError(
            "No visible digit was found in the image. "
            "Try an image with stronger contrast."
        )

    ys, xs = np.where(mask)
    cropped = arr[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

    # Fit the digit inside a 20x20 box, preserving aspect ratio.
    h, w = cropped.shape
    scale = 20.0 / max(h, w)
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))

    digit = Image.fromarray(cropped).resize(
        (new_w, new_h),
        Image.Resampling.LANCZOS,
    )

    # Center inside the standard 28x28 MNIST canvas.
    canvas = Image.new("L", (28, 28), 0)
    left = (28 - new_w) // 2
    top = (28 - new_h) // 2
    canvas.paste(digit, (left, top))

    values = np.asarray(canvas, dtype=np.float32) / 255.0
    return torch.from_numpy(values.copy()).view(1, 784)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path, help="Image file containing one digit.")
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("mnist_784_16_16_10.pt"),
        help="Model file produced by train.py.",
    )
    args = parser.parse_args()

    if not args.image.is_file():
        raise FileNotFoundError(f"Image not found: {args.image}")
    if not args.model.is_file():
        raise FileNotFoundError(f"Model not found: {args.model}")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    checkpoint = torch.load(args.model, map_location=device)
    architecture = checkpoint.get("architecture")
    if architecture is not None and architecture != [784, 16, 16, 10]:
        raise ValueError(
            f"Model architecture is {architecture}, expected [784, 16, 16, 10]."
        )

    model = DigitMLP().to(device)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    x = preprocess_image(args.image).to(device)

    with torch.no_grad():
        logits = model(x)
        probabilities = torch.softmax(logits, dim=1)[0]
        predicted = int(probabilities.argmax().item())

    top_probabilities, top_digits = torch.topk(probabilities, k=3)

    print(f"Prediction: {predicted}")
    print(f"Confidence: {probabilities[predicted].item() * 100:.2f}%")
    print("Top 3:")
    for digit, probability in zip(top_digits.tolist(), top_probabilities.tolist()):
        print(f"  {digit}: {probability * 100:.2f}%")


if __name__ == "__main__":
    main()
