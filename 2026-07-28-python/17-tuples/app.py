# tuple is a read only list
grades = (90, 80, 65, 45, 55, 46)

print(grades)

# no append
#grades.append

# no pop
#grades.pop

# no del
#del grades[0]

print(f"the length of the tuple is {len(grades)}")

for grade in grades:
    print(grade)