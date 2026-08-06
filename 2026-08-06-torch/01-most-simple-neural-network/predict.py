import torch
import torch.nn as nn

# the model file to load
model_file = "./linear_model.pt"

# we need a neural network in the exact same structure
# the model was trained on
model = nn.Linear(1, 1)

# load the wieghts and biases saved in the model file into the new
# neural network
model.load_state_dict(torch.load(model_file))
model.eval()

x = torch.tensor([[float(input("enter x"))]])

# create a separate scope
with torch.no_grad():
    y = model(x) # y = 2x + 1, model = 2x + 1 = wx + b

print(f"for input {x.item()} prediction is {y.item():.1f}")


