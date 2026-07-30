def get_average(items: list) -> float:
    sum: int = 0
    for item in items:
        sum += item
    return sum / len(items)

def get_sum(items: list) -> float:
    sum: int = 0
    for item in items:
        sum += item
    return sum    