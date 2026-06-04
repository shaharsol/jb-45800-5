const message: string = 'hello world'
// const anotherMessage: string = ['true']

// which types do we have?

// all the known primitive types
const someNumber: number = 98
const someString: string = 'some string'
const someBoolean: boolean = false
const anotherBoolean = 5 > 4

// arrays of primitives
const grades: number[] = [33, 55, 56]
const names: string[] = ['fsdfsd', 'fdgfdgdf']
const someFlags: boolean[] = [true, false, true]

// objects
const student: object = {}
let anotherStudent: object = {
    id: 1,
    name: 'moshe'
}
anotherStudent = {
    identificaton: 8,
    familyName: 'Katz'
}

// composite Type
type Student = {
    id: number,
    name: string,
    address: {
        street: string,
        streetNumber: number
    }
}

let someStudent: Student = {
    id: 1,
    name: 'moshe',
    address: {
        street: 'Herzl',
        streetNumber: 8
    }
}

let anotherSomeStudent: Student = {
    id: 4,
    name: "Hagit",
    address: {
        street: "Golan",
        streetNumber: 98
    }
}

const students: Student[] = [someStudent, anotherSomeStudent, {
    id: 0,
    // age: 22,
    name: "",
    address: {
        street: "",
        streetNumber: 0
    }
}]

// Function
const someFunc: Function = () => { return 2}

