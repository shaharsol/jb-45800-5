from shape import Shape


class Square(Shape):
    def __init__(self, x: int, y: int, side: float):
        super().__init__(x, y)
        self.side = side

    def display(self):
        super().display()
        print(f"side is {self.side}")

    def calculate_area(self):
        return self.side * self.side
        
