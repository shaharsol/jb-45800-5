from person import Person

class Employee(Person):
    def __init__(self, first_name: str, last_name: str, salary: float):
        super().__init__(first_name, last_name)
        self.salary = salary

    def __str__(self):
        return f"my name is {self.first_name} and i earn {self.salary}"

    def display(self):
        super().display()
        print("------------------")
        print(f"salary: {self.salary}")
        