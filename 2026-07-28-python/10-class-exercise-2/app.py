num1: int = int(input("enter a number: "))
num2: int = int(input("enter another number: "))

while num1 <= num2:
    print(num1)
    num1 += 1
else:
    print("num1 should be smaller than num2")