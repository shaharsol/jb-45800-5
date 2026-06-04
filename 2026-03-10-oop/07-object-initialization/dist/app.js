// the class is just a bunch of declarations
import Car from './car.js';
// when i actually want to use a class, i need to instansiate it
// in practice in TS, it means use the "new" keyword to create an object of that class
// here i create a real car into the mySkoda variable
const mySkoda = new Car('Skoda', 2000, 250, 'grey', 2020);
mySkoda.ignite();
mySkoda.drive();
mySkoda.break();
const myAudi80 = new Car('Audi', 1800, 120, 'brown', 1982);
myAudi80.ignite();
myAudi80.drive();
myAudi80.break();
