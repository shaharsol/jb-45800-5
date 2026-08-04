from shape import Shape


class Rectangle(Shape):
    
    def __init__(self, x: int, y: int, width: float, height: float):
        super().__init__(x, y)
        self.width = width
        self.height = height

    def display(self):
        super().display()
        print(f"width: {self.width}")
        print(f"height: {self.height}")

    def calculate_area(self):
        return self.width * self.height