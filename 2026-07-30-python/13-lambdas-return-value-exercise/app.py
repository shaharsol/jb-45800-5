def invoke_sum_function(mul_func: function, a: int, b: int):
    return mul_func(a, b)

number1 = int(input("enter a number "))
number2 = int(input("enter another number "))
print(f"{number1} * {number2} = {invoke_sum_function(lambda a, b: a * b, number1, number2)}")