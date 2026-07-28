student_grades = {"math": 90, "geography": 100, "english": 80, "history": 77}

sum = 0
for grade in student_grades.values():
    sum += grade

print(f"the average of grades is {sum/len(student_grades)}")