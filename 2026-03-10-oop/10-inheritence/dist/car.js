import Vehicle from './vehicle.js';
export default class Car extends Vehicle {
    numberOfDoors;
    static numberOfWheels = 4;
    steerWheel() {
        console.log('steering wheel...');
    }
    constructor(make, engineVolume, horsePower, color, model, priceBeforeTax, numberOfDoors) {
        super(make, engineVolume, horsePower, color, model, priceBeforeTax); // super is a special way to invoke the ancestor constructor
        this.numberOfDoors = numberOfDoors;
    }
}
