def say_hello():
    print("hello")
    print("hello again")

print("hello once again")
say_hello()    


def print_full_name(first_name, last_name):
    print(f"full name is {first_name} {last_name}")

print_full_name("israel", "israeli")    

def print_full_name_with_types(first_name: str, last_name: str) -> None:
    print(f"full name is {first_name} {last_name}")

# positional invocation
print_full_name_with_types("israel", "israeli")    

# keyword invocation
print_full_name_with_types(last_name = "israeli", first_name = "israel")    

# when i define a function i can decide to enable only one of the options
# either keyword or positional

def print_full_name_positional(first_name: str, last_name: str, /) -> None:
    print(f"full name is {first_name} {last_name}")

print_full_name_positional("israel", "israeli")
# pyright/pylance will not allow the following:
# print_full_name_positional(first_name = "israel", last_name = "israeli")




def print_full_name_keyword(*, first_name: str, last_name: str) -> None:
    print(f"full name is {first_name} {last_name}")

# pyright/pylance will not allow the following:
# print_full_name_keyword("israel", "israeli")
print_full_name_keyword(first_name = "israel", last_name = "israeli")


# i can define default for several of the parameters
# but i cant have a non-default after a default
def print_full_name_defaults(first_name: str = "Alex", last_name: str = "Katz") -> None:
    print(f"full name is {first_name} {last_name}")

print_full_name_defaults("yossi")

def get_average(n1: float, n2: float, n3: float) -> float:
    return (n1 + n2 + n3) / 3

print(get_average(100, 120, 150))    