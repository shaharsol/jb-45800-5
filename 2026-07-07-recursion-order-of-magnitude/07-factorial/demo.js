// a recursive function to calculate the factorial
// i.e. 4! = 4 * 3 * 2 * 1

const factorial = (n) => {
    if(n === 0) return 1
    return n * factorial(n - 1)
}


console.log(factorial(10))