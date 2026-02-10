let someVariable = 46
console.log(typeof someVariable)

console.log(`${typeof someVariable == 'number' ? 'number' : 'not number'}`)

someVariable = 'someString'

console.log(typeof someVariable)

console.log(`${typeof someVariable == 'number' ? 'number' : 'not number'}`)

someVariable = 3 > 1
console.log(typeof someVariable)

someVariable = [3, 4, 5]
console.log(typeof someVariable)

someVariable = {
    name: 'shahar',
    eyeColor: 'brown'
}
console.log(typeof someVariable)
console.log(typeof someVariable.name)

someVariable = JSON.stringify(someVariable)
console.log(typeof someVariable)
console.log(typeof someVariable.name)

function someFunction () {

}
console.log(typeof someFunction)

let aVariable
console.log(typeof aVariable)

let student = {
    firstName: 'Isarel',
    middleName: 'Moshe',
    lastName: 'Israeli'
}

console.log(typeof student.middleName)

student = {
    firstName: 'Isarel',
    middleName: null,
    lastName: 'Israeli'
}
console.log(typeof student.middleName)

// find out if some var is undefined
let someVar;
if(typeof someVar == 'undefined') {
    console.log('someVar is undefined')
} else {
    console.log('someVar is NOT undefined')
}
someVar = {}
if(typeof someVar == 'undefined') {
    console.log('someVar is undefined')
} else {
    console.log('someVar is NOT undefined')
}
someVar = null
if(someVar == null) {
    console.log('someVar is null')
} else {
    console.log('someVar is NOT null')
}

const person = {
    name: 'moshe',
    spouseName: 'moshit'
}

const anotherPerson = {
    name: 'moshe',
    spouseName: null
}
console.log(anotherPerson)






