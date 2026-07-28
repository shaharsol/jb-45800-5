def print_line(*, length: int) -> None:
    print('*' * length)

def print_rectangle(*, width: int, height: int) -> None:
    for row in range(height):
        print_line(length=width)

width = int(input("enter the width: "))
height = int(input("enter the height: "))

print_rectangle(width = width, height = height)