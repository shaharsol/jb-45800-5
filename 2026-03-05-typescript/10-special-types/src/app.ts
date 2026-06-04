let someVar: any

someVar = 8
someVar = ''

// with "any" variables, i can do whatever shit i want
// i can do aritmethics
const someAnyResult = someVar + 8

// i can invoke them as functions
someVar()

// the "any" type
// any tells TS not to enforce TS on this variable
// using any, is the most dangerous thing you can do in TS
// and therefore SHOULD NEVER BE DONE

let anotherVar: unknown

anotherVar = () => {}
anotherVar = 8
anotherVar = ''

// with unknows, i create variables that i am not sure what actual type is going
// to be populated in them, but TS will allow me to do Type Narrowing
// which means, check the type during runtime, and invoke appropriate actions
// for the specific type

// this is allowed:
if(typeof anotherVar === 'number') {
    const someResult = anotherVar + 8
}

// this is not allowed:
const someResult = anotherVar + 8

// this is not allowed
anotherVar()

// this is allowed:
if(typeof anotherVar === 'function') {
    anotherVar()
}

(async() => {
    const response = await fetch('https://dummyjson.com/users')
    // when i get EXTERNAL data into my program, i sometimes
    // cant tell in advance what the type will be.
    // in this case it is better to use "unknown" over "any"
    // because with unknown i still have TS enforcement
    const json: unknown = await response.json()
})

