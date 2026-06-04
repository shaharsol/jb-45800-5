students = [
    [96, 94, 60, 76], 
    [78, 87, 69, 63], 
    [40, 30, 100]
]

sum = 0
count = 0
// for (studentOffset = 0; studentOffset < students.length; studentOffset = studentOffset + 1) {
//     for (gradeOffset = 0; gradeOffset < students[studentOffset].length; gradeOffset = gradeOffset + 1) {
//         count = count + 1
//         sum = sum + students[studentOffset][gradeOffset]
//     }
// }

for (grades of students) {
    for (grade of grades) {
        count = count + 1
        sum = sum + grade
    }
}



console.log(`average is ${sum/count}`)