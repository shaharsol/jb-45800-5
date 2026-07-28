# the classic for loop of:
# - a var init
# - a condition
# - incremnetation
# doesn't exist in python
# for i:int = 0; i < 10; i++:
# if we want to run a for loop in python
# we must have some kind of collection

# list
grades = [90, 80, 78, 65]
for grade in grades:
    print(grade)


# a string is a list of characters
message: str = "hello world"    
for char in message:
    print(char, end="|")
