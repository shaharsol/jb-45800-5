def print_max(max_function: function):
    number1 = int(input("enter a number: "))
    number2 = int(input("enter a number: "))

    max: int = max_function(number1, number2)

    print(f"max number is {max}")

print_max(lambda a, b: a if a > b else b)    
