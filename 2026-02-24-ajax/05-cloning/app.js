const printPizza = pizza => {
    pizza.includingVat = pizza.price * 1.18
    delete pizza.location
    console.log(pizza)
}

const pizza = {
    diameter: 18,
    price: 20,
    slices: 8,
    toppings: 3,
    location: {
        longitude: 32.1,
        latitude: 34.3
    }
}

printPizza(pizza)

// apparently, the original pizza object is now mutated
console.log(pizza)

// mutating arguments in functions is a very very very bad practice
// console.log(pizza.location.latitude)

// to prevent mutations, we need to clone. if a function needs to change an argument, 
// it must clone it before, so it will not mutate the original data
const printPizzaBetter = pizza => {
    // 1st thing: clone pizza
    const newPizza = { ...pizza } // the "..." means: all the object properties
    newPizza.includingVat = newPizza.price * 1.18
    delete newPizza.location
    console.log(newPizza)
}

const pizza2 = {
    diameter: 18,
    price: 20,
    slices: 8,
    toppings: 3,
    location: {
        longitude: 32.1,
        latitude: 34.3
    }
}


printPizzaBetter(pizza2)
console.log(pizza2)


// we can clone arrays as well.
const grades = [10, 20, 30]
const otherGrades = [...grades]
otherGrades.push(90)
console.log(grades)
console.log(otherGrades)

// use the spread operator, to merge arrays
const array1 = [1, 2, 3]
const array2 = [4 ,5 ,6]
const array3 = [...array1, ...array2]
console.log(array3)

const obj1 = {
    name: 'israel'
}

const obj2 = {
    age: 22
}

const obj3 = {...obj1, ...obj2}
const obj4 = {obj1, obj2}
console.log(obj3)
console.log(obj4)