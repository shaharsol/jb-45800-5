from color import Color


my_color = Color.Green
another_color = Color.Red

print(f"my color is {my_color}")
print(f"are the colors matching? {my_color == another_color}")

print(f"my_color name is {my_color.name}")
print(f"my_color value is {my_color.value}")

print(f"another_color name is {another_color.name}")
print(f"another_color value is {another_color.value}")

user_code = int(input("enter a color number"))
for enum in Color:
    if user_code == enum.value:
        print(f"user entered the color {enum.name}")
