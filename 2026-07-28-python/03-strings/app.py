age: int = 30

one_year = "1"
two_years = "fgfdgdf"
# new_new_age = age + int(two_years) # this breaks

new_age: int = age + int(one_year)

print("your age is:", age) # works
# print("your age is:" + age) # this breaks
print("your age is: " + str(age))
print("your new age is", new_age)

is_adult = True
print("are you an adult?" + str(is_adult))

is_adult_str = "False"
print("are you an adult?", bool(is_adult_str))

is_adult_str_new = "Falsegfhggfd"
print("are you an adult?", bool(is_adult_str_new)) # this will use the falsy properties


first_name = "isarel"
last_name = "israeli"
print("your name is " + first_name + " " + last_name)
print(f"your name is {first_name} {last_name}") # equivalent to JS `${variable}`
