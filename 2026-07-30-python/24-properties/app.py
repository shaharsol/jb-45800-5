from person import Person

some_person = Person("Eliahu", "Baruch")

some_person.display()
print(some_person.first_name)
Person.greet()
# print(some_person.__unique_id)
# some_person.__display_separator()

# print(f"full name is {some_person.get_full_name()}")
print(f"full name is {some_person.full_name}")