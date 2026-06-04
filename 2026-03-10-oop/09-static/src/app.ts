// the class is just a bunch of declarations
import Car from './car.js'

// when i actually want to use a class, i need to instansiate it
// in practice in TS, it means use the "new" keyword to create an object of that class
// here i create a real car into the mySkoda variable
const mySkoda = new Car('Skoda', 2000, 250, 'grey', 2020, 70000)

mySkoda.ignite()
mySkoda.color = 'red' // I allow a car to be painted 
mySkoda.drive()
// mySkoda.make = 'Volkswagen' // I cannot allow a change of the make of the car, this is not logical
mySkoda.break()
console.log(`${mySkoda.make} price including tax is ${mySkoda.getPriceIncludingTax()}`)

const myAudi80 = new Car('Audi', 1800, 120, 'brown', 1982, 20000)

myAudi80.ignite()
myAudi80.drive()
myAudi80.break()

console.log(`${myAudi80.make} price including tax is ${myAudi80.getPriceIncludingTax()}`)


