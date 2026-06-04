grades = [92, 82, 99, 44, 72, 62, 52]
max = -Infinity 
min = Infinity 

for(offset = 0; offset < grades.length; offset = offset + 1) {
    if (grades[offset] > max) {
        max = grades[offset]
    }

    if (grades[offset] < min ) {
        min = grades[offset]
    }
}

console.log(`max grade is ${max}, min grade is ${min}`)
