grades = [90, 80, 78, 65, 54, 32, 98, 96, 70, 55]
max: int = 0
for grade in grades:
    if grade > max: 
        max = grade
        
print(f"max grade is {max}")
