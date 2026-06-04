function doSomething(arg) {
    console.log(arg)
    console.log(typeof arg)
    if(typeof arg === 'function') {
        arg(33)
    }
}

function doAnotherSomething(num) {
    console.log('hello from inside of function doAnotherSomething')
    console.log(num)
}


doSomething(doAnotherSomething)

