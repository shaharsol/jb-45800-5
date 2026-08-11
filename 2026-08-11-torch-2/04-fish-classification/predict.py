#!/usr/bin/env python3
"""
Predict the fish class for one image using a checkpoint created by train.py.

Example:
    python predict.py --model fish_classifier.pt --image "./some_fish.jpg"
    python predict.py --model fish_classifier.pt --image "./some_fish.jpg" --top_k 3
"""

from __future__ import annotations

import argparse
from pathlib import Path

import torch
from torch import nn
from PIL import Image
from torchvision import models, transforms


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict an aquarium fish class.")
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("fish_classifier.pt"),
        help="Checkpoint created by train.py.",
    )
    parser.add_argument(
        "--image",
        type=Path,
        required=True,
        help="Image to classify.",
    )
    parser.add_argument(
        "--top_k",
        type=int,
        default=3,
        help="How many predictions to print.",
    )
    return parser.parse_args()


def choose_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def load_checkpoint(path: Path, device: torch.device) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Model checkpoint not found: {path}")

    # weights_only=True is safer for checkpoints that contain only tensors and
    # basic Python types. Fall back for older PyTorch releases if necessary.
    try:
        checkpoint = torch.load(path, map_location=device, weights_only=True)
    except TypeError:
        checkpoint = torch.load(path, map_location=device)

    required = {"model_state_dict", "class_names"}
    missing = required - checkpoint.keys()
    if missing:
        raise RuntimeError(
            f"Checkpoint is missing required fields: {', '.join(sorted(missing))}"
        )
    return checkpoint


def build_model(checkpoint: dict, device: torch.device) -> nn.Module:
    architecture = checkpoint.get("architecture", "resnet18")
    if architecture != "resnet18":
        raise ValueError(f"Unsupported architecture: {architecture}")

    class_names = checkpoint["class_names"]
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, len(class_names))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()
    return model


def make_transform(checkpoint: dict):
    image_size = int(checkpoint.get("image_size", 224))
    mean = checkpoint.get("mean", [0.485, 0.456, 0.406])
    std = checkpoint.get("std", [0.229, 0.224, 0.225])

    return transforms.Compose(
        [
            transforms.Resize(int(image_size * 256 / 224)),
            transforms.CenterCrop(image_size),
            transforms.ToTensor(),
            transforms.Normalize(mean, std),
        ]
    )


def predict(
    model: nn.Module,
    image_path: Path,
    transform,
    class_names: list[str],
    device: torch.device,
    top_k: int,
):
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with Image.open(image_path) as image:
        image = image.convert("RGB")
        tensor = transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        logits = model(tensor)
        probabilities = torch.softmax(logits, dim=1)[0]

    k = max(1, min(top_k, len(class_names)))
    confidences, indices = torch.topk(probabilities, k=k)

    results = [
        (class_names[index.item()], confidence.item())
        for confidence, index in zip(confidences, indices)
    ]
    return results


def main() -> None:
    args = parse_args()
    device = choose_device()

    checkpoint = load_checkpoint(args.model, device)
    class_names = list(checkpoint["class_names"])
    model = build_model(checkpoint, device)
    transform = make_transform(checkpoint)

    results = predict(
        model=model,
        image_path=args.image,
        transform=transform,
        class_names=class_names,
        device=device,
        top_k=args.top_k,
    )

    best_name, best_confidence = results[0]
    print(f"Prediction: {best_name}")
    print(f"Confidence: {best_confidence:.2%}")

    if len(results) > 1:
        print("\nTop predictions:")
        for rank, (name, confidence) in enumerate(results, start=1):
            print(f"{rank}. {name}: {confidence:.2%}")


if __name__ == "__main__":
    main()