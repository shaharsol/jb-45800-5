function doSomething(arg) {
    console.log(arg)
    console.log(typeof arg)
}

function doAnotherSomething(matansArg) {
    console.log('hello from inside of function doAnotherSomething')
    return "i am the result of the function"
}

doSomething(5)
doSomething('hello world')
doSomething([1,2,3])
doSomething(['hello', 'world'])
doSomething({name: 'yossi', age: 12})

// i can invoke a function with an argument
// that is the invocation of another function
// but this is not what we want to demonstrate...
doSomething(doAnotherSomething())


doSomething(doAnotherSomething)

