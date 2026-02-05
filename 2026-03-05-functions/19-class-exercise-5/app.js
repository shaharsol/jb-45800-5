function isEven(number) {
    return number % 2 == 0
}

console.log(`the number 11 is ${isEven(11) ? 'even' : 'odd'}`)
console.log(`the number 16 is ${isEven(16) ? 'even' : 'odd'}`)

const num = +prompt('enter a number')
if(isEven(num)) {
    console.log(`${num} is even`)
} else {
    console.log(`${num} is odd`)
}