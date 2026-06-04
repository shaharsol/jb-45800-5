num = +prompt('enter a number')
current = 1

while (current != num + 1) {

    isDividingSeven = current % 7 == 0

    restOfNumber = current
    rightDigit = current % 10
    isSevenDigitInNumber = false
    stillHaveDigits = restOfNumber > 0
    
    while(stillHaveDigits && !isSevenDigitInNumber) {
        isSevenDigitInNumber = rightDigit == 7

        restOfNumber = Math.floor(restOfNumber / 10)
        rightDigit = restOfNumber % 10
        stillHaveDigits = restOfNumber > 0
    }

    if(isDividingSeven || isSevenDigitInNumber) {
        console.log('boom')
    } else {
         console.log(current)
    }
    current = current + 1

}