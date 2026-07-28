# set is an unordered list of unique items
# meaning, a certain value cannot appear more
# than once
# set enables O(1) access to elements
# so "guava" in fruits is O(1)
# whereas if it was in a list it would have been O(n)

fruits = {"apple", "banana", "strawberry", "blueberry", "banana", "apple", "orange"}
print(fruits)

fruits.add("guava")
print(fruits)

fruits.add("guava")
print(fruits)

if "guava" in fruits:
    fruits.remove("guava")
print(fruits)

if "guava" in fruits:
    fruits.remove("guava")
print(fruits)

grades = [45, 67, 88]
print(grades)

# list to tuple
my_tuple = tuple(grades)
print(my_tuple)
print(len(my_tuple))

# list to set
my_set = {*grades}
print(my_set)
print(len(my_set))
