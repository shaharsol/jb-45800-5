num1: int = int(input("enter 1st number: "))
num2: int = int(input("enter 2nd number: "))
num3: int = int(input("enter 3rd number: "))

if num1 >= num2 and num1 >= num3:
    print(num1)
elif num2 >= num3:
    print(num2)
else:
    print(num3)