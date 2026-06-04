// students = [
//     // ['Liran', '055-555555', 'Cohen'],
//     // ['Alex', '055-555444', 'Katz'],
//     // ['Meni', '202-7676767', 'Levi'],
//     ['Dor', 'Alon', '202-7676767'],
// ]

student = {
    firstName: 'Dor',
    familyName: 'Alon',
    phone: '202-7676767'
}

console.log(student.firstName)
console.log(student.phone)

student.id = '42142424242'
console.log(student.id)
console.log(student)

delete student.phone

console.log(student)

student.phone = '555-555555'

console.log(student)

for (property in student) {
    console.log(property)
    console.log(`property ${property} value is ${student.phone}`)
    console.log(`property ${property} value is ${student['phone']}`)
    console.log(`property ${property} value is ${student[property]}`)
}

// objects can be complex
student = {
    id: '3324234234',
    phone: '654543534',
    firstName: 'ffdgfd',
    middleName: 'fdsfsd',
    familyName: 'dsdsfsdfsdf'
}

student = {
    id: '3324234234',
    phone: '654543534',
    names: {
        first: 'Meirav',
        middle: 'Golda',
        family: 'Atedgi'
    }
}

console.log(student.names.family)
console.log(student.names)
console.log(student)

for (prop in student) {
    console.log(prop)
}

for (prop in student.names) {
    console.log(prop)
}


student = {
    id: '3324234234',
    phone: '654543534',
    names: {
        first: 'Meirav',
        middle: 'Golda',
        family: 'Atedgi'
    },
    grades: [96, 88, 48]
}

console.log(student.grades)
console.log(student.grades[0])

for(grade of student.grades) {
    console.log(grade)
}



