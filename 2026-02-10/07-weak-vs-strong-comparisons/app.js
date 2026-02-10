const myAge = 22
const yourAge = '22'

if(myAge == yourAge) {
    console.log('ages are equal')
} else {
    console.log('ages are NOT equal')
}

if(myAge === yourAge) {
    console.log('ages are equal')
} else {
    console.log('ages are NOT equal')
}

const student1 ={
    name: 'israel',
    spouseName: 'israelit'
}

const student2 ={
    name: 'israel',
    spouseName: 'israelit'
}

if(student1 == student2) {
    console.log('students are equal')
} else {
    console.log('students are NOT equal')
}

if(student1 === student2) {
    console.log('students are equal')
} else {
    console.log('students are NOT equal')
}

// comparison of objects NEVER compares property values, regardless of weak (==) or strong (===) comparison
// object comparison always checks if both objects are in the same "drawer"

const student3 = {
    name: 'israel',
    spouseName: 'israelit'
}

const student4 = student3

if(student3 == student4) {
    console.log('students are equal')
} else {
    console.log('students are NOT equal')
}

if(student3 === student4) {
    console.log('students are equal')
} else {
    console.log('students are NOT equal')
}

// == -> ===
// != -> !== 

