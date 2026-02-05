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

// lets say i want to send this data to another computerized system 
json = JSON.stringify(students)

console.log(students)
console.log(json)

// lets say i am consuming data that arrived from another compuetrized system
data = '[{"name":"ziva","grades":[99,88,77]},{"name":"ela","grades":[77,33,55]},{"name":"noa","grades":[77,66,55]}]'
students = JSON.parse(data)

console.log(data)
console.log(students)

