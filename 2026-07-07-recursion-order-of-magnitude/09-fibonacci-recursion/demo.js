const getFibonacci = (n) => {
    if(n <= 2) return 1    
    return getFibonacci(n - 1) + getFibonacci(n - 2)
}

console.log(getFibonacci(8)) // 21
console.log(getFibonacci(3)) // 2
console.log(getFibonacci(1)) // 1
