num = +prompt('enter a number')
sum = 0
// 8451
restOfNumber = num
rightDigit = num % 10
// 8451
while(restOfNumber > 0) {
    // actual calcualtion
    sum = sum + rightDigit

    // preperation for next loop iteration
    restOfNumber = Math.floor(restOfNumber / 10)
    rightDigit = restOfNumber % 10
}


console.log(`sum is ${sum}`)
