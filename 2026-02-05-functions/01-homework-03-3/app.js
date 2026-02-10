grades = []
invalidGrades = []

for(counter = 1; counter <= 10; counter = counter + 1) {
    grades.push(+prompt('enter a grade'))
}

for(grade of grades) {
    if(grade < 0 || grade > 100) {
        invalidGrades.push(grade)
    }
}

if (invalidGrades.length == 0) {
    alert('all grades are valid')
} else {
    alert('some grades are not valid')
    alert(`invalid grades are ${invalidGrades}`)
}