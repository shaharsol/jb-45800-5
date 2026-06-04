function myFunc () {}

// Fortunately, we can go back to use the "function" keyword
// as TypeScript will never allow us to override a declared function
// myFunc = 3

// when we pass argument to functions, typescript enforces us
// to be EXPLICIT about the types
function sum (a: number, b: number) {
    return a + b
}

// i can (and i should) be explicit about function return values
function multiply(a: number, b: number): number {
    const result = a * b
    return result
}

