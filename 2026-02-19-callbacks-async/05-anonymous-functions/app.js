function filter(array, callback) {
    const result = []
    for(const item of array) {
        if(callback(item)) {
            result.push(item)
        }
    }
    return result
}

const grades = [90, 80, 40, 30, 95]

// javascript allows us to use unnamed (anonymous) functions when we pass functions as arguments
const passingGrades = filter(grades, function (grade) {
    return grade > 60
})
const failingGrades = filter(grades, function isFailingGrade(grade) {
    return grade <= 60
})
const roundedGrades = filter(grades, function (grade) {
    return grade % 10 === 0
})
console.log(passingGrades)
console.log(failingGrades)
console.log(roundedGrades)

const students = [
    {
        name: 'Kirill',
        age: 39,
        finalGrade: 92
    }, {
        name: 'Alex',
        age: 50,
        finalGrade: 85
    }, {
        name: 'Oz',
        age: 25,
        finalGrade: 100
    }
]

const above30Students = filter(students, function isAbove30(student) {
    return student.age > 30
})
function isExcellent(student){
    return student.finalGrade > 90
}
const excellentStudents = filter(students, isExcellent)

console.log(above30Students)
console.log(excellentStudents)

console.log(isExcellent(students[0]))
