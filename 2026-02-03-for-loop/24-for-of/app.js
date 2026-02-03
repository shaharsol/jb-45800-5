grades = [96, 94, 60, 76] 

for (offset = 0; offset < grades.length; offset = offset + 1) {
    console.log(grades[offset])
}

for (grade of grades) {
    console.log(grade)    
}