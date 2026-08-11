#!/usr/bin/env python3
"""
Train a cat-vs-dog image classifier with PyTorch.

Expected Kaggle dataset layout:
    <data-dir>/
        Cat/
            ...
        Dog/
            ...

You may also pass the directory that CONTAINS PetImages:
    <data-dir>/
        PetImages/
            Cat/
            Dog/

Example:
    python train.py --data-dir ./PetImages --epochs 8
"""

import argparse
import random
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torch.utils.data import DataLoader, Subset
from torchvision import datasets, models, transforms
from torchvision.models import ResNet18_Weights


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def parse_args():
    parser = argparse.ArgumentParser(description="Train a cat/dog classifier.")
    parser.add_argument(
        "--data-dir",
        type=Path,
        required=True,
        help="Path to PetImages, or to a directory containing PetImages.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("cat_dog_model.pth"),
        help="Where to save the trained checkpoint.",
    )
    parser.add_argument("--epochs", type=int, default=8)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=1e-4)
    parser.add_argument(
        "--val-split",
        type=float,
        default=0.2,
        help="Fraction of images reserved for validation.",
    )
    parser.add_argument("--image-size", type=int, default=224)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--no-pretrained",
        action="store_true",
        help="Do not use ImageNet-pretrained ResNet-18 weights.",
    )
    parser.add_argument(
        "--freeze-backbone",
        action="store_true",
        help="Train only the final classification layer.",
    )
    return parser.parse_args()


def choose_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def resolve_dataset_root(path: Path) -> Path:
    """Accept either PetImages itself or its parent directory."""
    path = path.expanduser().resolve()

    if (path / "Cat").is_dir() and (path / "Dog").is_dir():
        return path

    pet_images = path / "PetImages"
    if (pet_images / "Cat").is_dir() and (pet_images / "Dog").is_dir():
        return pet_images

    raise FileNotFoundError(
        f"Could not find Cat/ and Dog/ under '{path}' or '{pet_images}'."
    )


def is_valid_image(path: str) -> bool:
    """
    ImageFolder calls this while building the dataset.

    It filters unsupported/corrupted image files so a bad image does not stop
    an entire training run.
    """
    p = Path(path)
    if p.suffix.lower() not in IMAGE_EXTENSIONS:
        return False

    try:
        with Image.open(p) as image:
            image.verify()
        return True
    except (OSError, ValueError):
        return False


def make_transforms(image_size: int):
    # Standard ImageNet normalization used with pretrained ResNet models.
    normalize = transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    )

    train_transform = transforms.Compose(
        [
            transforms.RandomResizedCrop(image_size, scale=(0.75, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(
                brightness=0.15,
                contrast=0.15,
                saturation=0.15,
            ),
            transforms.ToTensor(),
            normalize,
        ]
    )

    val_transform = transforms.Compose(
        [
            transforms.Resize(image_size + 32),
            transforms.CenterCrop(image_size),
            transforms.ToTensor(),
            normalize,
        ]
    )

    return train_transform, val_transform


def build_model(num_classes: int, pretrained: bool, freeze_backbone: bool):
    weights = ResNet18_Weights.DEFAULT if pretrained else None
    model = models.resnet18(weights=weights)

    if freeze_backbone:
        for parameter in model.parameters():
            parameter.requires_grad = False

    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)

    # The new final layer must remain trainable even when the backbone is frozen.
    for parameter in model.fc.parameters():
        parameter.requires_grad = True

    return model


def run_epoch(model, loader, criterion, device, optimizer=None):
    training = optimizer is not None
    model.train(training)

    total_loss = 0.0
    total_correct = 0
    total_examples = 0

    context = torch.enable_grad() if training else torch.inference_mode()

    with context:
        for images, labels in loader:
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            if training:
                optimizer.zero_grad(set_to_none=True)

            logits = model(images)
            loss = criterion(logits, labels)

            if training:
                loss.backward()
                optimizer.step()

            batch_size = labels.size(0)
            total_loss += loss.item() * batch_size
            total_correct += (logits.argmax(dim=1) == labels).sum().item()
            total_examples += batch_size

    return total_loss / total_examples, total_correct / total_examples


def main():
    args = parse_args()

    if not 0.0 < args.val_split < 1.0:
        raise ValueError("--val-split must be between 0 and 1.")
    if args.epochs < 1:
        raise ValueError("--epochs must be at least 1.")

    random.seed(args.seed)
    torch.manual_seed(args.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(args.seed)

    dataset_root = resolve_dataset_root(args.data_dir)
    device = choose_device()

    print(f"Dataset: {dataset_root}")
    print(f"Device:  {device}")
    print("Scanning images and ignoring unreadable/corrupt files...")

    train_transform, val_transform = make_transforms(args.image_size)

    # Two ImageFolder instances allow different transforms while sharing the
    # same deterministic train/validation indices.
    full_train = datasets.ImageFolder(
        dataset_root,
        transform=train_transform,
        is_valid_file=is_valid_image,
    )
    full_val = datasets.ImageFolder(
        dataset_root,
        transform=val_transform,
        is_valid_file=is_valid_image,
    )

    if full_train.classes != full_val.classes:
        raise RuntimeError("Training/validation class mappings do not match.")

    expected = {"Cat", "Dog"}
    if set(full_train.classes) != expected:
        raise ValueError(
            f"Expected class folders {sorted(expected)}, "
            f"but found {full_train.classes}."
        )

    num_images = len(full_train)
    num_val = max(1, int(num_images * args.val_split))
    num_train = num_images - num_val

    generator = torch.Generator().manual_seed(args.seed)
    permutation = torch.randperm(num_images, generator=generator).tolist()
    val_indices = permutation[:num_val]
    train_indices = permutation[num_val:]

    train_dataset = Subset(full_train, train_indices)
    val_dataset = Subset(full_val, val_indices)

    print(f"Classes:     {full_train.class_to_idx}")
    print(f"Train size:  {num_train}")
    print(f"Val size:    {num_val}")

    pin_memory = device.type == "cuda"
    persistent_workers = args.workers > 0

    train_loader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.workers,
        pin_memory=pin_memory,
        persistent_workers=persistent_workers,
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.workers,
        pin_memory=pin_memory,
        persistent_workers=persistent_workers,
    )

    model = build_model(
        num_classes=len(full_train.classes),
        pretrained=not args.no_pretrained,
        freeze_backbone=args.freeze_backbone,
    ).to(device)

    trainable_parameters = [p for p in model.parameters() if p.requires_grad]
    optimizer = torch.optim.AdamW(
        trainable_parameters,
        lr=args.learning_rate,
        weight_decay=1e-4,
    )
    criterion = nn.CrossEntropyLoss()

    best_val_accuracy = -1.0
    args.output.parent.mkdir(parents=True, exist_ok=True)

    for epoch in range(1, args.epochs + 1):
        train_loss, train_accuracy = run_epoch(
            model, train_loader, criterion, device, optimizer
        )
        val_loss, val_accuracy = run_epoch(
            model, val_loader, criterion, device
        )

        print(
            f"Epoch {epoch:02d}/{args.epochs} | "
            f"train loss {train_loss:.4f} | "
            f"train acc {train_accuracy * 100:6.2f}% | "
            f"val loss {val_loss:.4f} | "
            f"val acc {val_accuracy * 100:6.2f}%"
        )

        if val_accuracy > best_val_accuracy:
            best_val_accuracy = val_accuracy

            checkpoint = {
                "architecture": "resnet18",
                "model_state_dict": model.state_dict(),
                "class_to_idx": full_train.class_to_idx,
                "image_size": args.image_size,
                "best_val_accuracy": best_val_accuracy,
            }
            torch.save(checkpoint, args.output)
            print(f"  Saved new best model -> {args.output}")

    print(
        f"\nFinished. Best validation accuracy: "
        f"{best_val_accuracy * 100:.2f}%"
    )
    print(f"Model checkpoint: {args.output}")


if __name__ == "__main__":
    main()
