import struct
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

DATA_DIR = Path("C:/Users/jbt/Downloads/mnist")
MODEL_PATH = Path("models/mnist_model.pt")
MODEL_PATH.parent.mkdir(exist_ok=True)

BATCH_SIZE = 64
EPOCHS = 30
LR = 0.001


def load_images(path):
    with open(path, "rb") as f:
        magic, count, rows, cols = struct.unpack(">IIII", f.read(16))
        data = torch.frombuffer(bytearray(f.read()), dtype=torch.uint8)

    images = data.reshape(count, rows * cols).float() / 255.0
    return images


def load_labels(path):
    with open(path, "rb") as f:
        magic, count = struct.unpack(">II", f.read(8))
        labels = labels = torch.frombuffer(bytearray(f.read()), dtype=torch.uint8).long()

    return labels


X_train = load_images(DATA_DIR / "train-images.idx3-ubyte")
y_train = load_labels(DATA_DIR / "train-labels.idx1-ubyte")

X_test = load_images(DATA_DIR / "t10k-images.idx3-ubyte")
y_test = load_labels(DATA_DIR / "t10k-labels.idx1-ubyte")

train_loader = DataLoader(
    TensorDataset(X_train, y_train),
    batch_size=BATCH_SIZE,
    shuffle=True,
)

test_loader = DataLoader(
    TensorDataset(X_test, y_test),
    batch_size=BATCH_SIZE,
)

model = nn.Sequential(
    nn.Linear(28 * 28, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 10),
)

loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for X_batch, y_batch in train_loader:
        logits = model(X_batch)
        loss = loss_fn(logits, y_batch)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            logits = model(X_batch)
            predictions = logits.argmax(dim=1)

            correct += (predictions == y_batch).sum().item()
            total += y_batch.size(0)

    accuracy = correct / total

    print(
        f"epoch={epoch + 1}, "
        f"loss={total_loss / len(train_loader):.4f}, "
        f"test_accuracy={accuracy:.4f}"
    )

torch.save(model.state_dict(), MODEL_PATH)
print(f"Saved model to {MODEL_PATH}")