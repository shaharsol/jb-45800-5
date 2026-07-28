grades = [65, 72, 88, 96, 45, 67, 88]
print(grades)

# adds a value to the end of the list
grades.append(95)
print(grades)

# inserts a value into the exact offset (in js we would have used splice)
grades.insert(3, 77)
print(grades)

# removes the 1st occurence of an item by value, breaks if the value is not present
grades.remove(88)
print(grades)

grades.remove(88)
print(grades)

grades.append(88)
grades.append(88)
grades.append(88)
print(grades)

while 88 in grades: # in checks for presence of value in list
    grades.remove(88)
print(grades)

# removes an item from the list using offset
del grades[3]
print(grades)

# removes the last item
grades.pop()
print(grades)

# removes an item from the list using offset, while allowing preservantion of the removed value
popped_value = grades.pop(3)
print(grades)
print(popped_value)

# length of a list
print(len(grades))

# python doesnt care about the types of the items, can be mixed
mix = [23, "fjgjfdhgd", True]
print(mix)
