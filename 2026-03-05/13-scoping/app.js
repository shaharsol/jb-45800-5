// these variables will belong to the global javascript scope
// why? because they seem not be part of any other scope
// they are not within any {}
age = +prompt('enter your age')
const btl = 'bituch leumi'
// kupatHolim = ''

// 
// 1. let. let vars are assignable anytime
// 2. const vars are unassignable apart from initialization
const countryClubName = 'Country North'
console.log(countryClubName)
// countryClubName = 'Country South'
console.log(countryClubName)

// if i use const, i must initalize the var:
// const isPenicilin
const numberOfPeopleAllowedInside = 100
console.log(numberOfPeopleAllowedInside)
// after intializing the const var, i can not re-assign
// numberOfPeopleAllowedInside = 60

console.log(numberOfPeopleAllowedInside)

if ( age > 65 ) {
    btl = +prompt('enter your social security number')
    kupatHolim = prompt('enter your kupat holim')
}

let numberOfRetries = 3
numberOfRetries = 2
grades = [66,77,88]
let counter = 0;
while( counter < grades.length) {
    counter = counter + 1
}

for(let counter = 0; counter < grades.length; counter = counter + 1) {

}

for(const grade of grades) {
    console.log(grade)
    
}

// console.log(counter)


console.log(age)
console.log(btl)
console.log(kupatHolim)
