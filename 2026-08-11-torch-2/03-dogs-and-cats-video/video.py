#!/usr/bin/env python3
"""
Analyze a video for cat/dog presence using a model trained by train.py.

The script:
1. Uses ffmpeg to extract every Nth frame (default: every 30 frames).
2. Runs each sampled frame through the trained PyTorch model.
3. Marks Cat or Dog as present if ANY sampled frame has confidence strictly
   greater than the chosen threshold (default: 98%).

Example:
    python video.py --model cat_dog_model.pth --video ./example.mp4

Optional:
    python video.py --model cat_dog_model.pth --video ./example.mp4 \
        --sample-every 30 --threshold 0.98

Requirements:
    pip install torch torchvision pillow

FFmpeg must also be installed and available on PATH.
"""

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms


def parse_args():
    parser = argparse.ArgumentParser(
        description="Analyze a video for cat/dog presence."
    )
    parser.add_argument(
        "--model",
        type=Path,
        default=Path("cat_dog_model.pth"),
        help="Checkpoint created by train.py.",
    )
    parser.add_argument(
        "--video",
        type=Path,
        required=True,
        help="Video file to analyze.",
    )
    parser.add_argument(
        "--sample-every",
        type=int,
        default=30,
        help="Extract one frame every N video frames. Default: 30.",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.98,
        help="Presence threshold. Default: 0.98 (strictly greater than 98%%).",
    )
    return parser.parse_args()


def choose_device():
    if torch.cuda.is_available():
        return torch.device("cuda")

    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")

    return torch.device("cpu")


def load_checkpoint(path: Path, device):
    try:
        return torch.load(path, map_location=device, weights_only=True)
    except TypeError:
        return torch.load(path, map_location=device)


def build_model(num_classes: int):
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


def ensure_ffmpeg_exists():
    if shutil.which("c/ffmpeg/bin/ffmpeg") is None:
        raise RuntimeError(
            "ffmpeg was not found on PATH. Install FFmpeg and make sure "
            "the 'ffmpeg' command is available."
        )


def extract_frames(video_path: Path, output_dir: Path, sample_every: int):
    """Extract frame 0, frame N, frame 2N, ... using FFmpeg."""
    output_pattern = output_dir / "frame_%08d.jpg"

    command = [
        "c/ffmpeg/bin/ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(video_path),
        "-vf",
        f"select=not(mod(n\\,{sample_every}))",
        "-vsync",
        "vfr",
        "-q:v",
        "2",
        str(output_pattern),
    ]

    subprocess.run(command, check=True)
    return sorted(output_dir.glob("frame_*.jpg"))


def classify_frame(model, transform, image_path: Path, device):
    with Image.open(image_path) as image:
        image = image.convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        logits = model(input_tensor)
        return torch.softmax(logits, dim=1)[0]


def main():
    args = parse_args()

    model_path = args.model.expanduser().resolve()
    video_path = args.video.expanduser().resolve()

    if not model_path.is_file():
        raise FileNotFoundError(f"Model checkpoint not found: {model_path}")

    if not video_path.is_file():
        raise FileNotFoundError(f"Video file not found: {video_path}")

    if args.sample_every < 1:
        raise ValueError("--sample-every must be at least 1.")

    if not 0.0 < args.threshold < 1.0:
        raise ValueError("--threshold must be between 0 and 1.")

    ensure_ffmpeg_exists()

    device = choose_device()
    checkpoint = load_checkpoint(model_path, device)

    if checkpoint.get("architecture") != "resnet18":
        raise ValueError(
            f"Unsupported architecture: {checkpoint.get('architecture')!r}"
        )

    class_to_idx = checkpoint["class_to_idx"]
    image_size = int(checkpoint.get("image_size", 224))
    idx_to_class = {index: name for name, index in class_to_idx.items()}

    required_classes = {"Cat", "Dog"}
    if set(class_to_idx) != required_classes:
        raise ValueError(
            f"Expected model classes {sorted(required_classes)}, "
            f"but checkpoint contains {sorted(class_to_idx)}."
        )

    model = build_model(num_classes=len(class_to_idx))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    transform = make_transform(image_size)

    found = {"Cat": False, "Dog": False}
    best_confidence = {"Cat": 0.0, "Dog": 0.0}
    best_frame = {"Cat": None, "Dog": None}

    print(f"Video:         {video_path}")
    print(f"Model:         {model_path}")
    print(f"Device:        {device}")
    print(f"Sample every:  {args.sample_every} frames")
    print(f"Threshold:     > {args.threshold * 100:.2f}%")
    print()

    with tempfile.TemporaryDirectory(prefix="cat_dog_video_") as temp_dir:
        frames_dir = Path(temp_dir)

        print("Extracting sampled frames with ffmpeg...")
        frame_paths = extract_frames(
            video_path=video_path,
            output_dir=frames_dir,
            sample_every=args.sample_every,
        )

        if not frame_paths:
            raise RuntimeError(
                "FFmpeg did not extract any frames from the video."
            )

        print(f"Extracted {len(frame_paths)} sampled frames.")
        print("Analyzing frames...")

        for frame_number, frame_path in enumerate(frame_paths, start=1):
            probabilities = classify_frame(
                model=model,
                transform=transform,
                image_path=frame_path,
                device=device,
            )

            for class_index, class_name in idx_to_class.items():
                confidence = float(probabilities[class_index].item())

                if confidence > best_confidence[class_name]:
                    best_confidence[class_name] = confidence
                    best_frame[class_name] = frame_number

                if confidence > args.threshold:
                    if not found[class_name]:
                        print(
                            f"{class_name} detected above threshold "
                            f"at sampled frame {frame_number}: "
                            f"{confidence * 100:.2f}%"
                        )
                    found[class_name] = True

            if found["Cat"] and found["Dog"]:
                break

    print()
    print("Results:")
    print(
        "Cat exists in the video"
        if found["Cat"]
        else "Cat does not exist in the video"
    )
    print(
        "Dog exists in the video"
        if found["Dog"]
        else "Dog does not exist in the video"
    )

    print()
    print("Highest sampled-frame confidence:")
    for class_name in ("Cat", "Dog"):
        confidence = best_confidence[class_name] * 100
        frame_number = best_frame[class_name]

        if frame_number is None:
            print(f"{class_name}: no result")
        else:
            print(
                f"{class_name}: {confidence:.2f}% "
                f"(sampled frame {frame_number})"
            )


if __name__ == "__main__":
    main()
