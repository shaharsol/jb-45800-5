// fibonacci
// in fibonacci series, each item is equal to the sum of the 2 previous items

// 1 1 2 3 5 8 13 21 34 ....

// a non-recursive function that gets n and returns the fibonacci value of n
// that is, the value of the nth item in fibonacci

// example: fibonacci(8) = 21
const fibonacci = (n) => {
    if(n === 1) return 1
    if(n === 2) return 1
    let first = 1
    let second = 1
    let current;
    for(let i = 3; i <= n; i++) {
        current = first + second
        first = second
        second = current
    }
    return current
}

console.log(fibonacci(9)) // should echo 34