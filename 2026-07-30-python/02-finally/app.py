try:
    number: int = int(input("enter a number for division: "))
    result: float = 100 / number
    print(result)
except ValueError:
    print('value error')    
except ZeroDivisionError:
    print('zero division error')
    result2: float = 100 / 0
finally:
    print('logic is done, either good or bad')

# print('logic is done, either good or bad')

