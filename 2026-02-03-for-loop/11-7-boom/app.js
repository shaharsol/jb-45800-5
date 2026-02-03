num = +prompt('enter a number')
current = 1

while (current != num + 1) {

    isDividingSeven = current % 7 == 0

    if(isDividingSeven || isSevenDigitInNumber) {
        console.log('boom')
    } else {
         console.log(current)
    }
    current = current + 1

}