class Car:
    def __init__(self: Car, make: str, model: str, color: str, price: float):
        self.make = make
        self.model = model
        self.color = color
        self.price = price

    def display(self):
        print(f"Make: {self.make}")
        print(f"Model: {self.model}")
        print(f"Color: {self.color}")
        print(f"Price: {self.price}")

    @property
    def brand(self):
        return f"{self.make} {self.model}"

