from calc import get_average, get_sum
from convertors.lists import list_to_tuple


grades = [90, 88, 76]

print(f"the average grade is {get_average(grades)}")
print(f"the sum of grades is {get_sum(grades)}")

grades_tuple = list_to_tuple(grades)
print(f"grades as tuple", grades_tuple)