def give_factor(grade: int) -> float:
    if grade < 0 or grade > 100:
        raise ValueError('grade must be between 0 and 100')
    return (grade ** 0.5) * 10

try:
    grade = int(input("enter a grade: "))
    print(f"the factored grade is {give_factor(grade)}")
except ValueError as err:
    print(f"there was a bad input: {err}")
