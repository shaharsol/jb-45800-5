function doubleCalc(a, b) {
    return {
        plus: a + b,
        minus: a - b
    }
}
console.log(doubleCalc(7,2).minus)
console.log(doubleCalc(7,2).plus)

const result = doubleCalc(7,2)
console.log(result.plus)

console.log(doubleCalc(+prompt('enter a number'), +prompt('enter another number')))


const obj = {
    min: 4,
    max: 10
}

obj.min = 3
console.log(obj)