import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

# target model file
model_file = "./circle_model.pt"

# how many samples i want for training
num_samples: int = 100

# in an imaginary box sized from -1,-1 to 1,1 what is the radius
# of the circle
radius: float = 0.7

# now i want to generate {num_samples} random X's
X = torch.rand(num_samples, 2) * 2 - 1
dist_from_center = torch.sqrt(X[:, 0] ** 2 + X[:, 1] ** 2)
y = (dist_from_center < radius).float().unsqueeze(1)

train_size = int(0.8 * num_samples)

X_train = X[:train_size]
y_train = y[:train_size]

X_val = X[train_size:]
y_val = y[train_size:]

train_ds = TensorDataset(X_train, y_train)
val_ds = TensorDataset(X_val, y_val)

train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=64)

# at this point we have all we need to start the training
# what we need now is a neural network
model = nn.Sequential(
    nn.Linear(2, 16),
    nn.ReLU(),
    nn.Linear(16, 16),
    nn.ReLU(),
    nn.Linear(16, 1)
)

# we need a loss function
loss_fn = nn.BCEWithLogitsLoss()

# we need an optimizer to implement the backward propagation
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# now we can start training
epochs = 10

for epoch in range(epochs):
    model.train()
    total_loss = 0.0

    for batch_X, batch_y in train_loader:
        logits = model(batch_X)
        loss = loss_fn(logits, batch_y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    model.eval()

    correct = 0
    total = 0

    with torch.no_grad():
        for batch_X, batch_y in val_loader:
            logits = model(batch_X)

            probabilities = torch.sigmoid(logits)
            predictions = (probabilities >= 0.5).float()

            correct += (predictions == batch_y).sum().item()
            total += batch_y.numel()

    val_accuracy = correct / total

    avg_loss = total_loss / len(train_loader)
    print(f"epoch={epoch:.03d} loss={avg_loss:.4f} val_accuracy={val_accuracy:.4f}")






