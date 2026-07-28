# dictionary is the python equivalent of the js object
student = {"name": "yossi", "age": 36, "grades": [30, 50, 60], "is_male": True}
print(student)

print(f"the name of the student is {student['name']}")
print(f"the age of the student is {student['age']}")
print(f"the grades of the student is {student['grades']}")

# if i add the same key twice, the last value persists
student = {"name": "yossi", "age": 36, "age": 37, "grades": [30, 50, 60], "is_male": True}
print(student)

if "is_male" in student:
    print(student["is_male"])

# access to undefined key breaks
# print(student["is_malefdgdfgdfr"])

student["university"] = "tel aviv uni"
print(student)

del student["university"]
print(student)


