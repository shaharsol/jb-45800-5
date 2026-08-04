from abc import ABC, abstractmethod
import math

class Shape(ABC):

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def display(self):
        print(f"position is ({self.x},{self.y})")

    @abstractmethod
    def calculate_area(self):
        pass