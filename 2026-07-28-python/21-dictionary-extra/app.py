fruit_prices = {"apple": 9.90, "banana": 5.6, "apricotte": 7.8, "plum": 11.9}
print(fruit_prices)

print("-------------------")

for fruit in fruit_prices.keys():
    print(f"the price of {fruit} is {fruit_prices[fruit]}")

print("-------------------")

for price in fruit_prices.values():
    print(price) 

print("-------------------")

for fruit_price in fruit_prices.items():
    print(fruit_price)       
    print(f"the price of {fruit_price[0]} is {fruit_price[1]}")

print("-------------------")

# python version of deconstruction is called unpacking
for fruit_price in fruit_prices.items():
    print(fruit_price)       
    name, price = fruit_price
    print(f"the price of {name} is {price}")    

print("-------------------")

# a better version of the above loop:
for name, price in fruit_prices.items():
    print(f"the price of {name} is {price}")    
