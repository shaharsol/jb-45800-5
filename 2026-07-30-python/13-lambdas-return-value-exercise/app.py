def invoke_sum_function(mul_func: function):
    return mul_func(10, 20)

print(f"10 + 20 = {invoke_sum_function(lambda a, b: a + b)}")