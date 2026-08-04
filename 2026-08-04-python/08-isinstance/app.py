
from circle import Circle
from square import Square
from rectangle import Rectangle


circle = Circle(10, 20, 40)
circle.display()
print(f"area of circle is {circle.calculate_area()}")

square = Square(10, 20, 12)
square.display()
print(f"area of square is {square.calculate_area()}")

rectangle = Rectangle(x = 10, 
                      y = 20, 
                      width = 20, 
                      height = 50)
rectangle.display()
print(f"area of rectangle is {rectangle.calculate_area()}")


if circle.x == 10:
    # print('x is 10')
    pass # pass enables me to maintain the sytnax without actually having code
else:
    print('x is not 10')


my_shapes = [circle, square, rectangle]    

for shape in my_shapes:
    if isinstance(shape, Circle):
        print(f"the radius of the circle is {shape.radius}")    
    elif isinstance(shape, Square):
        print(f"the side of the square is {shape.side}")    
    elif isinstance(shape, Rectangle):
        print(f"the height of the rectangle is {shape.height}")    
