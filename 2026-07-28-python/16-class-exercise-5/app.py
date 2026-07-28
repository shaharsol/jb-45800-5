names = []

for n in range(5):
    names.append(input("enter your name: "))

max = 0
max_idx = -1
idx = 0
for name in names:
    if len(name) > max:
        max = len(name)
        max_idx = idx
    idx += 1


print(f"the longest name is {names[max_idx]}")


