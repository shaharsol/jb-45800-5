import torch
import torch.nn as nn

# target model file
model_file = "./linear_model.pt"

# this is the neural network i would have build
# for the hand writing alphabet recognition:
# model = nn.Linear(256, 52, 52, 26)
model = nn.Linear(1, 1)

# this is a loss function that is used after each eoph to calc
# how bad the network did. the network aim is to reduce this
# function's result with each iteration, therefore, to find the 
# loss function minimum
loss_fn = nn.MSELoss()

# this is the function that will be used for the back propogation
# process, this is the process that once a network calcs the cost (the 
# result of the lost function) it back propgates the results to the 
# previous layer and let it know how to adjust the weights
# so it perform better next time
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)

# an arbitrary number of iterations to run
epochs: int = 8000

# we need training data
x_train = torch.tensor([[-10.0], [-9.0], [-8.0], [-7.0], [-6.0], [-5.0], [-4.0], [-3.0], [-2.0], [-1.0], [0.0], [1.0], [2.0], [3.0], [4.0], [5.0], [6.0], [7.0], [8.0], [9.0], [10.0]])
y_train = 2 * x_train + 1

# repeating epochs times
for epoch in range(epochs):

    # run the network with all the current weights and biases
    # in the 1st epoch, the wieght and the bias (there is only one weight and one bias in this netwrok)
    # the weight and the bias will be completely random
    prediction = model(x_train)

    # after the netwrok ran all training data with the *current* weights and biases
    # i need to calculate the cost, i.e. run the loss function
    loss = loss_fn(prediction, y_train)

    # run the back propogation, let each layer inform the previous layer
    # what would i want the weights (and the bias) to be in order for the result to be better
    optimizer.zero_grad()

    # do the backward propogation calculation
    loss.backward()

    # imply the backward propogation calculation on all the weights and biases in the network
    optimizer.step()

    if epoch % 50 == 0:
        print(f"epoch={epoch} loss={loss.item():.12f}")

# here once the loop is finished, and the loss is ~ 0.0000 we will save the model in a file
# what's in the model file? weights and biases
print(f"found weight: {model.weight.item()}")
print(f"found bias: {model.bias.item()}")

torch.save(model.state_dict(), model_file)
print(f"saved model to {model_file}")





