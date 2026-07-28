grade: int = int(input("enter a grade:"))

if grade > 60:
    print("pass")
else:
    print("fail")


print("pass" if grade > 60 else "fail")

# won't work
# print("pass" if grade > 60 elif grade > 30 "fail" else "total fail")