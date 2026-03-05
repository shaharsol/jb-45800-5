let message: string = 'hello world'
// message = 8
// TypeScript is an implicit language. it ASSUMES a type based on the 
// first assignment it finds 
let anotherMessage = 'another message'


let someNumber = 9

type Student = {
    id: number,
    name: string
}

let a: Student = {
    id: 1,
    name: 'moshe'
}

let b = a

let c = {...a}

let d: Student = c

