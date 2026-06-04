// the class is just a bunch of declarations
import Car from './car.js'

// when i actually want to use a class, i need to instansiate it
// in practice in TS, it means use the "new" keyword to create an object of that class
// here i create a real car into the mySkoda variable
const mySkoda = new Car()
mySkoda.make = 'Skoda'
mySkoda.model = 2020
mySkoda.color = 'grey'
mySkoda.engineVolume = 2000
mySkoda.horsePower = 250

mySkoda.ignite()
mySkoda.drive()
mySkoda.break()

const myAudi80 = new Car()
myAudi80.make = 'Audi'
myAudi80.model = 1982
myAudi80.engineVolume = 1800
myAudi80.horsePower = 120
myAudi80.color = 'brown'

myAudi80.ignite()
myAudi80.drive()
myAudi80.break()



