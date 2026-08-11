#!/usr/bin/env python3
"""
Predict whether one image contains a cat or a dog.

Example:
    python prdeict.py --model cat_dog_model.pth --image ./my_photo.jpg
"""

import argparse
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms


def parse_args():
    parser = argparse.ArgumentParser(description="Predict cat vs dog.")
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("cat_dog_model.pth"),
        help="Checkpoint created by train.py.",
    )
    parser.add_argument(
        "--image",
        type=Path,
        required=True,
        help="Image to classify.",
    )
    return parser.parse_args()


def choose_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def load_checkpoint(path: Path, device):
    # weights_only=True is preferable for checkpoints that contain tensors and
    # basic Python data. The fallback keeps compatibility with older PyTorch.
    try:
        return torch.load(path, map_location=device, weights_only=True)
    except TypeError:
        return torch.load(path, map_location=device)


def build_model(num_classes: int):
    # Do not download pretrained weights here. The trained state_dict contains
    # every parameter needed for inference.
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def make_transform(image_size: int):
    return transforms.Compose(
        [
            transforms.Resize(image_size + 32),
            transforms.CenterCrop(image_size),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )


def main():
    args = parse_args()
    model_path = args.model.expanduser().resolve()
    image_path = args.image.expanduser().resolve()

    if not model_path.is_file():
        raise FileNotFoundError(f"Model checkpoint not found: {model_path}")
    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    device = choose_device()
    checkpoint = load_checkpoint(model_path, device)

    if checkpoint.get("architecture") != "resnet18":
        raise ValueError(
            f"Unsupported architecture: {checkpoint.get('architecture')!r}"
        )

    class_to_idx = checkpoint["class_to_idx"]
    image_size = int(checkpoint.get("image_size", 224))

    idx_to_class = {index: name for name, index in class_to_idx.items()}

    model = build_model(num_classes=len(class_to_idx))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    transform = make_transform(image_size)

    with Image.open(image_path) as image:
        image = image.convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        logits = model(input_tensor)
        probabilities = torch.softmax(logits, dim=1)[0]
        predicted_index = int(probabilities.argmax().item())
        confidence = float(probabilities[predicted_index].item())

    predicted_class = idx_to_class[predicted_index]

    print(f"Prediction: {predicted_class}")
    print(f"Confidence: {confidence * 100:.2f}%")

    # Also show both class probabilities.
    for index in sorted(idx_to_class):
        print(f"{idx_to_class[index]}: {probabilities[index].item() * 100:.2f}%")


if __name__ == "__main__":
    main()
