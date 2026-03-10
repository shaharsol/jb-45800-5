// the class is just a bunch of declarations
import Car from './car.js'
import Bike from './bike.js'


// when i actually want to use a class, i need to instansiate it
// in practice in TS, it means use the "new" keyword to create an object of that class
// here i create a real car into the mySkoda variable
const mySkoda = new Car('Skoda', 2000, 250, 'grey', 2020, 70000, 5)

mySkoda.ignite()
mySkoda.color = 'red' // I allow a car to be painted 
mySkoda.drive()
// mySkoda.make = 'Volkswagen' // I cannot allow a change of the make of the car, this is not logical
mySkoda.break()
console.log(`${mySkoda.make} price including tax is ${mySkoda.getPriceIncludingTax()}`)

const myAudi80 = new Car('Audi', 1800, 120, 'brown', 1982, 20000, 4)

myAudi80.ignite()
myAudi80.drive()
myAudi80.break()
myAudi80.steerWheel()

console.log(`${myAudi80.make} price including tax is ${myAudi80.getPriceIncludingTax()}`)

const myKTM = new Bike('KTM', 950, 90, 'orange', 2018, 4000)
console.log(`my bike make is ${myKTM.make}`)
myKTM.ignite()
myKTM.turnHandle('right')

// i cannot have access to members that are defined as protected/private
// console.log(`the custom clerk of my audi is ${myAudi80.customClerk}`)




