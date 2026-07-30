def say_hello():
    print("hello")

def invoke_another_function(func: function):
    func()

def get_sum(a: int, b: int):
    return a + b

def invoke_sum_function(sum_func: function, a: int, b: int):
    return sum_func(a, b)

invoke_another_function(say_hello)   
print(f"10 + 20 = {invoke_sum_function(get_sum, 10, 20)}")