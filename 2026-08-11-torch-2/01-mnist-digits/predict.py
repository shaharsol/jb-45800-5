import sys
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image, ImageOps

MODEL_PATH = Path("models/mnist_model.pt")

model = nn.Sequential(
    nn.Linear(28 * 28, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 10),
)

model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()


def load_input_image(path):
    image = Image.open(path).convert("L")

    # Resize to MNIST size
    image = image.resize((28, 28))

    # Convert to tensor: values 0..1
    pixels = torch.tensor(list(image.getdata()), dtype=torch.float32) / 255.0

    # MNIST expects white digit on black background.
    # If your image is black digit on white background, invert it.
    if pixels.mean() > 0.5:
        pixels = 1.0 - pixels

    return pixels.unsqueeze(0)


if len(sys.argv) != 2:
    print("Usage: python predict_mnist.py path/to/digit.png")
    sys.exit(1)

image_path = sys.argv[1]
x = load_input_image(image_path)

with torch.no_grad():
    logits = model(x)
    probabilities = torch.softmax(logits, dim=1)
    predicted_digit = probabilities.argmax(dim=1).item()
    confidence = probabilities[0, predicted_digit].item()

print({
    "file": image_path,
    "prediction": predicted_digit,
    "confidence": confidence,
})