// single values in variables
grade1 = 96
grade2 = 94
grade3 = 60
grade4 = 76

// the same single values in a single array
grades = [96, 94, 60, 76] 
// ordinal 1  2   3   4  this is the human way of specifying items in an array
// offset 0   1   2   3


// i can treat the array as a variable
console.log(grades)


grades2 = [96, 94, 60, 76, 'eighty eight'] 
console.log(grades2)

// single item access
console.log(grades[2])

// changing a value of array item
grades[3] = 100 
console.log(grades)

// anectode - a string is an array of characters
studentName = 'Yossi' // ['Y', 'o', 's', 's', 'i']
console.log(studentName[1])
studentName[1] = 'T'
console.log(studentName[1])
studentName = 'Aviram' + 'Yossi'
console.log(studentName[1])
console.log(studentName)

// array length
console.log(`there are ${grades.length} grades in the grades array`)
console.log(`the length of ${studentName} is ${studentName.length}`)

// add array items
grades.push(40)
console.log(grades)

grades.push(+prompt('enter anoter grade'))
console.log(grades)

// if we want to loop an array we do so with for loop





