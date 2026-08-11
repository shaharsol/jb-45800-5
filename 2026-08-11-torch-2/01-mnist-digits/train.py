#!/usr/bin/env python3
"""
Train a 784 -> 16 -> 16 -> 10 fully-connected neural network on MNIST.

Example:
    python train.py --data-dir ./mnist --epochs 20 --model mnist_784_16_16_10.pt

The data directory may contain the standard MNIST IDX files directly or inside
subdirectories. Both uncompressed files and .gz files are supported.
"""

import argparse
import gzip
import random
import struct
from pathlib import Path

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset


class DigitMLP(nn.Module):
    """Exactly: 784 inputs -> 16 -> 16 -> 10 outputs."""

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


class MNISTDataset(Dataset):
    def __init__(self, images: np.ndarray, labels: np.ndarray):
        # Keep images as uint8 to reduce RAM usage.
        self.images = torch.from_numpy(images.copy())
        self.labels = torch.from_numpy(labels.astype(np.int64, copy=True))

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, index):
        # Convert 28x28 uint8 image to a normalized 784-element float vector.
        x = self.images[index].float().div_(255.0).view(784)
        y = self.labels[index]
        return x, y


def open_idx(path: Path):
    """Open an IDX file, transparently handling gzip-compressed files."""
    if path.suffix.lower() == ".gz":
        return gzip.open(path, "rb")
    return open(path, "rb")


def read_idx_images(path: Path) -> np.ndarray:
    with open_idx(path) as f:
        header = f.read(16)
        if len(header) != 16:
            raise ValueError(f"{path} is too short to be an MNIST image file.")

        magic, count, rows, cols = struct.unpack(">IIII", header)
        if magic != 2051:
            raise ValueError(
                f"{path} has IDX magic number {magic}; expected 2051 for images."
            )
        if rows * cols != 784:
            raise ValueError(
                f"{path} contains {rows}x{cols} images, but this network expects 28x28."
            )

        raw = f.read(count * rows * cols)
        if len(raw) != count * rows * cols:
            raise ValueError(f"{path} ended before all image data was read.")

    return np.frombuffer(raw, dtype=np.uint8).reshape(count, rows, cols)


def read_idx_labels(path: Path) -> np.ndarray:
    with open_idx(path) as f:
        header = f.read(8)
        if len(header) != 8:
            raise ValueError(f"{path} is too short to be an MNIST label file.")

        magic, count = struct.unpack(">II", header)
        if magic != 2049:
            raise ValueError(
                f"{path} has IDX magic number {magic}; expected 2049 for labels."
            )

        raw = f.read(count)
        if len(raw) != count:
            raise ValueError(f"{path} ended before all label data was read.")

    return np.frombuffer(raw, dtype=np.uint8)


def find_idx_file(data_dir: Path, split: str, kind: str) -> Path:
    """
    Find an MNIST IDX file recursively.

    Supports names such as:
      train-images-idx3-ubyte
      train-images.idx3-ubyte
      train-images-idx3-ubyte.gz
      t10k-labels-idx1-ubyte
    """
    files = [p for p in data_dir.rglob("*") if p.is_file()]
    split_tokens = ("train",) if split == "train" else ("t10k", "test")
    kind_token = "image" if kind == "images" else "label"

    candidates = []
    for path in files:
        name = path.name.lower()
        if kind_token not in name:
            continue
        if not any(token in name for token in split_tokens):
            continue

        # Prefer files that look like IDX/ubyte files.
        score = 0
        if "ubyte" in name:
            score += 3
        if "idx" in name:
            score += 2
        if path.suffix.lower() == ".gz":
            score += 1
        candidates.append((score, len(str(path)), path))

    if not candidates:
        raise FileNotFoundError(
            f"Could not find the {split} {kind} IDX file under: {data_dir}\n"
            f"Expected a filename containing '{kind_token}' and "
            f"{'train' if split == 'train' else 't10k/test'}."
        )

    candidates.sort(key=lambda item: (-item[0], item[1]))
    return candidates[0][2]


def load_split(data_dir: Path, split: str):
    image_path = find_idx_file(data_dir, split, "images")
    label_path = find_idx_file(data_dir, split, "labels")

    print(f"{split.capitalize()} images: {image_path}")
    print(f"{split.capitalize()} labels: {label_path}")

    images = read_idx_images(image_path)
    labels = read_idx_labels(label_path)

    if len(images) != len(labels):
        raise ValueError(
            f"{split} image/label count mismatch: {len(images)} images, "
            f"{len(labels)} labels."
        )

    return images, labels


@torch.no_grad()
def evaluate(model, loader, device):
    model.eval()
    loss_fn = nn.CrossEntropyLoss()

    total_loss = 0.0
    total_correct = 0
    total_samples = 0

    for x, y in loader:
        x = x.to(device)
        y = y.to(device)

        logits = model(x)
        loss = loss_fn(logits, y)

        total_loss += loss.item() * y.size(0)
        total_correct += (logits.argmax(dim=1) == y).sum().item()
        total_samples += y.size(0)

    return total_loss / total_samples, total_correct / total_samples


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path("./mnist"),
        help="Directory containing the downloaded/extracted MNIST files.",
    )
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("mnist_784_16_16_10.pt"),
        help="Output model filename.",
    )
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--learning-rate", type=float, default=1e-3)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(args.seed)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    train_images, train_labels = load_split(args.data_dir, "train")
    test_images, test_labels = load_split(args.data_dir, "test")

    print(f"Training samples: {len(train_labels):,}")
    print(f"Test samples:     {len(test_labels):,}")

    train_set = MNISTDataset(train_images, train_labels)
    test_set = MNISTDataset(test_images, test_labels)

    train_loader = DataLoader(
        train_set,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=0,
        pin_memory=(device.type == "cuda"),
    )
    test_loader = DataLoader(
        test_set,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=(device.type == "cuda"),
    )

    model = DigitMLP().to(device)
    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=args.learning_rate)

    print(model)
    print("\nTraining...")

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        samples = 0

        for x, y in train_loader:
            x = x.to(device)
            y = y.to(device)

            optimizer.zero_grad(set_to_none=True)
            logits = model(x)
            loss = loss_fn(logits, y)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * y.size(0)
            correct += (logits.argmax(dim=1) == y).sum().item()
            samples += y.size(0)

        train_loss = running_loss / samples
        train_accuracy = correct / samples
        test_loss, test_accuracy = evaluate(model, test_loader, device)

        print(
            f"Epoch {epoch:02d}/{args.epochs} | "
            f"train loss {train_loss:.4f} | "
            f"train acc {train_accuracy * 100:6.2f}% | "
            f"test loss {test_loss:.4f} | "
            f"test acc {test_accuracy * 100:6.2f}%"
        )

    args.model.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "architecture": [784, 16, 16, 10],
            "model_state_dict": model.state_dict(),
        },
        args.model,
    )

    print(f"\nSaved trained model to: {args.model}")


if __name__ == "__main__":
    main()
