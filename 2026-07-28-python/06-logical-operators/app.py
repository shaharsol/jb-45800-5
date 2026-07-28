num1: int = int(input("enter a number: "))
num2: int = int(input("enter another number: "))

if num1 > num2:
    print("whatever")
else:
    print("nevermind")


if num1 < num2:
    print("whatever")
else:
    print("nevermind")    

if num1 >= num2:
    print("whatever")
else:
    print("nevermind")    

if num1 == num2:
    print("whatever")
else:
    print("nevermind")    

if num1 != num2:
    print("whatever")
else:
    print("nevermind")    

num3: int = int(input("enter a 3rd number: "))    

if num1 > num2 and num1 > num3:
    print("yeahhh")
else:
    print("nayyy")

if num1 > num2 or num1 > num3:
    print("yeahhh")
else:
    print("nayyy")    

if not num1 > num2:
    print("noooooot")    
else:
    print("yeeeees")