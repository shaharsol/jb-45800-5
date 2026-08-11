#!/usr/bin/env python3
"""
predict.py

Run object detection on a single image using Hugging Face's
facebook/detr-resnet-50 model with PyTorch.

Install dependencies:
    pip install torch torchvision transformers pillow timm

Usage:
    python predict.py path/to/image.jpg
    python predict.py path/to/image.jpg --threshold 0.7

The script prints a JSON list. Each detection contains:
    - label: detected object class
    - confidence: confidence score from 0.0 to 1.0
    - box: [xmin, ymin, xmax, ymax] in original-image pixel coordinates
"""

import argparse
import json
from pathlib import Path
from typing import Any

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForObjectDetection


MODEL_NAME = "facebook/detr-resnet-50"


def get_device() -> torch.device:
    """Choose CUDA, then Apple MPS, otherwise CPU."""
    if torch.cuda.is_available():
        return torch.device("cuda")

    if (
        hasattr(torch.backends, "mps")
        and torch.backends.mps.is_available()
    ):
        return torch.device("mps")

    return torch.device("cpu")


def load_model(
    device: torch.device,
) -> tuple[AutoImageProcessor, AutoModelForObjectDetection]:
    """Load the DETR image processor and object-detection model."""
    processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
    model = AutoModelForObjectDetection.from_pretrained(MODEL_NAME)
    model.to(device)
    model.eval()
    return processor, model


def predict(
    image_path: str | Path,
    threshold: float = 0.5,
) -> list[dict[str, Any]]:
    """
    Detect objects in one image.

    Args:
        image_path:
            Path to the input image.
        threshold:
            Minimum confidence score for a detection to be returned.

    Returns:
        A list of dictionaries like:
        [
            {
                "label": "person",
                "confidence": 0.987654,
                "box": [xmin, ymin, xmax, ymax]
            }
        ]

        Box coordinates are pixel coordinates in the original image.
    """
    if not 0.0 <= threshold <= 1.0:
        raise ValueError("threshold must be between 0.0 and 1.0")

    image_path = Path(image_path)
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    device = get_device()
    processor, model = load_model(device)

    with Image.open(image_path) as img:
        image = img.convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    inputs = {name: tensor.to(device) for name, tensor in inputs.items()}

    with torch.inference_mode():
        outputs = model(**inputs)

    # target_sizes expects (height, width), while PIL image.size is (width, height).
    target_sizes = torch.tensor(
        [[image.height, image.width]],
        device=device,
    )

    result = processor.post_process_object_detection(
        outputs,
        target_sizes=target_sizes,
        threshold=threshold,
    )[0]

    detections: list[dict[str, Any]] = []

    for score, label_id, box in zip(
        result["scores"],
        result["labels"],
        result["boxes"],
    ):
        xmin, ymin, xmax, ymax = box.detach().cpu().tolist()

        detections.append(
            {
                "label": model.config.id2label[int(label_id.item())],
                "confidence": float(score.item()),
                "box": [
                    float(xmin),
                    float(ymin),
                    float(xmax),
                    float(ymax),
                ],
            }
        )

    # Highest-confidence detections first.
    detections.sort(key=lambda item: item["confidence"], reverse=True)
    return detections


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=f"Detect objects in an image with {MODEL_NAME}."
    )
    parser.add_argument(
        "image",
        help="Path to a single input image.",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.5,
        help="Minimum confidence from 0.0 to 1.0 (default: 0.5).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    detections = predict(args.image, threshold=args.threshold)
    print(json.dumps(detections, indent=2))


if __name__ == "__main__":
    main()