from person import Person


class Customer(Person):

    def __init__(self, 
                 first_name: str, 
                 last_name: str, 
                 address: str, 
                 credit_card: str):
        
        super().__init__(first_name, last_name)
        self.address = address
        self.credit_card = credit_card

    def display(self):
        super().display()
        print("------------------")
        print(f"Address: {self.address}")
        print(f"Credit card: {self.credit_card}")
