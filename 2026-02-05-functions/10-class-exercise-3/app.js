students = [
    {
        name: 'moshe',
        grades: [99, 88, 77]
    }, {
        name: 'yossi',
        grades: [77, 33, 55]
    }, {
        name: 'eli',
        grades: [77, 66, 55]
    }
]

for (student of students) {
    sum = 0
    for(grade of student.grades) {
        sum = sum + grade
    }
    console.log(`average of ${student.name} is ${sum/student.grades.length}`)
}