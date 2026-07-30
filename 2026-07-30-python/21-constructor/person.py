class Person:

    def __init__(self, first_name: str, last_name: str):
        self.first_name = first_name
        self.last_name = last_name

    def say_hi(self):
        print(f"hi from {self.first_name} {self.last_name}")

    def get_first_name(self) -> str:
        return self.first_name