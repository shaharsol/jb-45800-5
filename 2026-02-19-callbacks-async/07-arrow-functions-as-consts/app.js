// why do we need arrow functions in JavaScript?
// arrow functions are not only used for callbacks, there is
// another reason to use arrow functions

function doSomething() {
    console.log('i am doing something')
}

function doAnotherThing() {
    console.log('i am doing another thing')
}

// a javascript functions acts like a ?
// 1. let <== js functions are essentially let variables
// 2. const
doSomething = doAnotherThing

// since we can override the function variable
// it is ultra dangerous to use functions
// we can not know if a function variable still
// contains a function when we invoke it
doSomething = 3 

// doSomething()


// the solution is, to use a const:
const addNumbers = (a, b) => {
    return a + b
}

console.log(typeof addNumbers)
console.log(`2 + 7 equals ${addNumbers(2, 7)}`)
