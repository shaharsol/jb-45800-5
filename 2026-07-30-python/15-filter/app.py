from sys import getsizeof

grades = [45, 55, 65, 78, 98, 79, 22, 36, 100, 33, 65, 45, 55, 65, 78, 98, 79, 22, 36, 100, 33, 65, 45, 55, 65, 78, 98, 79, 22, 36, 100, 33, 65, 45, 55, 65, 78, 98, 79, 22, 36, 100, 33, 65, 45, 55, 65, 78, 98, 79, 22, 36, 100, 33, 65]

# passing grade is 60+

passing_grades = filter(lambda grade: grade >= 60, grades)
print(passing_grades)
print(f"size of filter object: {getsizeof(passing_grades)}")
# for grade in passing_grades:
#     print(grade, end = ", ")
# print()

passing_grades_list = list(passing_grades)
print(passing_grades_list)
print(f"size of list generated from filter object: {getsizeof(passing_grades_list)}")


