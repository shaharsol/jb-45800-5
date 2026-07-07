const start = () => {
    console.log('starting...')
    cont()
}

const cont = () => {
    console.log('continuing...')
    finish()
}

const finish = () => {
    console.log('finishinbg...')
    throw new Error('something went wrong')
}

const sayHello = () => {
    console.log('hello demo')
    sayHello()
}

sayHello()
// start()
