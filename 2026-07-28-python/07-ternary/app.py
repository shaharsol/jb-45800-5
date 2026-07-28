grade: int = int(input("enter a grade:"))

if grade > 60:
    print("pass")
else:
    print("fail")


print("pass" if grade > 60 else "fail")