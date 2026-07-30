def get_price_including_vat(price: float) -> float:
    if price < 0:
        raise ValueError('price must not be smaller than 0')    
    return price * 1.18


try:
    price: float = float(input("enter a price without vat: "))
    print(f"price with vat is {get_price_including_vat(price)}")
except ValueError as err:
    print(f"dont enter invalid data: {err}")