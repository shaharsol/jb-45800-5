from math import pi

from shape import Shape

class Circle(Shape):
    def __init__(self, x: int, y: int, radius: float):
        super().__init__(x, y)
        self.radius = radius

    def display(self):
        super().display()
        print(f"radius is {self.radius}")

    def calculate_area(self) -> float:
        return pi * self.radius**2
