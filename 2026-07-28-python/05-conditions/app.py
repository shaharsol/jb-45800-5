age: int = int(input("enter your age: "))

if age < 13:
    print("enter for free")
    print("also free ice cream in the cafetria")
elif age < 18:
    print("pay youth fee")
elif age < 65:
    print("pay adult fee")
else:
    print("enter for senior citizen fee")

# there is NO switch command in python

print("music show begins at 18:00")