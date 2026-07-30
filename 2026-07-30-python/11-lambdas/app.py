# def say_hello():
#     print("hello")

def invoke_another_function(func: function):
    func()

# def get_sum(a: int, b: int):
#     return a + b

def invoke_sum_function(sum_func: function):
    return sum_func(10, 20)

# this is an inline anonymous "arrow" function
# similar to () => {} in js
invoke_another_function(lambda: print("hello from a lambda function"))   
print(f"10 + 20 = {invoke_sum_function(lambda a, b: print(a + b))}")