const students = [
    {
        name: 'Kirill',
        familyName: 'Kuznezov',
        age: 39,
        finalGrade: 92
    }, {
        name: 'Alex',
        familyName: 'Tamsie',
        age: 50,
        finalGrade: 85
    }, {
        name: 'Oz',
        familyName: 'wizard of',
        age: 25,
        finalGrade: 100
    }
]
// reduce recieves two arguments, a callback function                          and initial value
const averageGrade = students.reduce((cumulative, current) => cumulative + current.finalGrade, 0) / students.length
const averageAge = students.reduce((cumulative, current) => cumulative + current.age, 0) / students.length
console.log(`averageGrade is ${averageGrade}`)
console.log(`averageAge is ${averageAge}`)

// filter receives a callback function that returns a boolean that signifies
// whether the current item should be included or filtered out
const seniorStudents = students.filter(item => item.age > 30)
console.log(`senior students`, seniorStudents)

// map transforms an array, to another array, where each array in the result array
// is a calculation of values from the original array
const fullNames = students.map(item => `${item.name} ${item.familyName}`)
console.log(fullNames)

// find returns the 1st occurrence of the searched item
const firstStudentWithHighGrade = students.find(student => student.finalGrade > 90)
console.log(firstStudentWithHighGrade)

const failedStudent = students.find(student => student.finalGrade < 60)
console.log(failedStudent)

// many times, a find will be followed by an if
if(failedStudent) {
    console.log('we have a failure')
}

// sort
const sortedByAge = students.sort((a, b) => a.age > b.age ? 1 : -1)
console.log(sortedByAge)

// lets say i want names of students ordered by age
console.log(
    students
        .sort((a, b) => a.age > b.age ? 1 : -1)
        .map(student => `${student.name} ${student.familyName}`)
)

// forEach - just a loop (doesn't fall in any other HOF logic)
students.forEach(student => console.log(student.name))

// DON'T use map where you should use forEach!!!
// you use map when you need a result array
// if you don't need the mapping result, use forEach
students.map(student => console.log(student.name))


