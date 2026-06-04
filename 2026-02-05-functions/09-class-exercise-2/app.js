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

sum = 0;
count = 0;
for (student of students ) {
    for (grade of student.grades) {
        sum = sum + grade
        count = count + 1
    }
}
console.log(`avergae is ${sum/count}`)