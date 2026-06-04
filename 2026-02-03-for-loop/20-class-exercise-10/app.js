grades = [92, 82, 72, 62, 52]
sum = 0

for(offset = 0; offset < grades.length; offset = offset + 1) {
    sum = sum + grades[offset]
}

console.log(`average of grades is ${sum/grades.length}`)
