// bad example 1 - missing safe types
let x = prompt('enter a number')
let y = prompt('enter a number')

function sum(a, b) {
    return a + b
}

console.log(sum(x, y))

// bad example 2
function mult(a, b) {
    const result = a * b
}

console.log(mult(3,4))

// bad example 3 - missing safe types
function divide(a, b) {
    return  a / b
}

divide = 'please divide'

console.log(divide(16,2))