import math # i import the entire module
from random import randint

number = int(input("enter a number: "))

# print(f"the aquare root of {number} is {number ** 0.5}")
print(f"the aquare root of {number} is {math.floor(math.sqrt(number))}") # then use functions from the module

random_number = randint(10, 20)
print(f"here is a random number: {random_number}")


