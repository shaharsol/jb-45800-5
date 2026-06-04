import Bike from "./bike.js";
import Car from "./car.js";
import Shop from "./shop.js";
import Vehicle from "./vehicle.js";

const car = new Car('Honda', 1996)
const bike = new Bike('ktm', 2012)

const clonedHonda = {...car} 

function cloneVehicle(itemToclone: Vehicle) {
    return {...itemToclone} as Vehicle
}

const anotherClonedHonda = cloneVehicle(car)
const anotherClonedKtm = cloneVehicle(bike)

// i want to take this set of functions and generalize
// to a single function
function cloneCar(car: Car): Car {
    return {...car} as Car
}
function cloneBike(bike: Bike): Bike {
    return {...bike} as Bike
}

// this is the generalized function.
// T here is like a placeholder for a Type, which will be 
// determined only during run time
function clonePrecise<T>(itemToClone: T) {
    return {...itemToClone} as T
}

const clonedBike = clonePrecise(bike)
const clonedCar = clonePrecise(car)

const shop = new Shop('castro', 'dizengoff center', 'castro.co.il')

const clonedShop = clonePrecise<Shop>(shop)

function clonePreciseVehicle<T extends Vehicle>(itemToClone: T) {
    return {...itemToClone} as T
}

const clonedBike2 = clonePreciseVehicle(bike)
const clonedCar2 = clonePreciseVehicle(car)

const clonedShop2 = clonePreciseVehicle(shop)

