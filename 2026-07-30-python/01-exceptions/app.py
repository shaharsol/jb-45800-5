# grandmother cooked an oathmeal

try:

    number_of_grandchildren: int = int(input("how many grandchildren you have granny? "))

    number_of_oatmeals: int = 10

    oatmeals_per_grandchild: float = number_of_oatmeals / number_of_grandchildren

    print(f"every grandchild receives {oatmeals_per_grandchild} oatmeals")

    # grandkids = ['moshe', 'israel', 'shimi']
    # grandkids.remove('osnat')

# the most general exception handler:
# except:
#     print('some error occured')

# i can treat the exception as a variable and then be able to 
# use it for specific exception handling
# except Exception as err:
#     print(err)

# i can investigate the type of the exception
# or in other words, instance of which class is it...
# except Exception as err:
#     print(type(err))    

# except ValueError:
#     print("don't guz guz guz me")
except ZeroDivisionError as err:
    print("don't enter a zero: ", err)
except Exception:
    print("unknown error...")
finally:
    print('Done')