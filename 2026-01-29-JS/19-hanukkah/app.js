sumOfCandles = 0
currentDay = 1

while (currentDay < 9) {
    candlesPerDay = 1 + currentDay
    sumOfCandles = sumOfCandles + candlesPerDay
    currentDay = currentDay + 1
}

alert(sumOfCandles)


