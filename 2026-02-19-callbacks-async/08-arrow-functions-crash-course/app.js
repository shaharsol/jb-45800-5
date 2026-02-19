// arrow functions can be shortened like hell

const someFunction = (a, b) => { 
    return a + b
}

// there are several rules we can apply to shorten the code for arrow functions

// if a function has just a single argument, then we can omit the parenthesis ()
const someFunctionWithASingleArgument = (singleArgument) => {
    console.log(singleArgument)
}

const someOtherFunctionWithASingleArgument = singleArgument => {
    console.log(singleArgument)
}

// if a function has just a single command bewteen the {}
// then we can omit the {}
const someShortFunction = (a, b) => {
    console.log(a + b)
}

const someShorterFunction = (a, b) => console.log(a + b)

// if i use this ^^^^ shortening style, then the value of the single command is automatically returned
// i dont need to use the return keyowrd
const sum = (a, b) => {
    return a + b
}

// the shortest function ever example.... a function that accepts one argument
// does some calc on it and return it, for example square power
const power = (a) => {return a**2}
const shorterPower = a => a**2

// if the arguments list is empty, i must have empty parenthesis:
const someFunc = () => console.log(3);
const someOtherFunc = () => {}



const anotherSum = (a, b) => a + b


someShorterFunction(2,5)
console.log(anotherSum(5,7))
console.log(power(4))

