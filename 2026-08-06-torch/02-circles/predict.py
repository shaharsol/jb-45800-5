import torch
import torch.nn as nn

model_file = "./circle_model.pt"

model = nn.Sequential(
    nn.Linear(2, 24),
    nn.ReLU(),
    nn.Linear(24, 16),
    nn.ReLU(),
    nn.Linear(16, 1)
)

checkpoint = torch.load(model_file)
radius = checkpoint["radius"]
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

x = float(input(f"enter x for radius {radius}: "))
y = float(input(f"enter y for radius {radius}: "))

point = torch.tensor([[x, y]], dtype=torch.float32)

with torch.no_grad():
    logit = model(point)
    probability = torch.sigmoid(logit).item()

prediction = "inside" if probability >= 0.5 else "outside"

print(f"{x},{y} is {prediction} the circle")


