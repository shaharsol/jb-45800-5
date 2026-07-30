from random import randint


class Person:

    def __init__(self, first_name: str, last_name: str):
        self.first_name = first_name
        self.last_name = last_name
        self.__unique_id = randint(1, 100000)

    def say_hi(self):
        print(f"hi from {self.first_name} {self.last_name}")

    def get_first_name(self) -> str:
        return self.first_name

    def display(self):
        print(f"first name: {self.first_name}")
        self.__display_separator()
        print(f"last name: {self.last_name}")
        self.__display_separator()
        print(f"uniqe id: {self.__unique_id}")

    def __display_separator(self):
        print("------------------")