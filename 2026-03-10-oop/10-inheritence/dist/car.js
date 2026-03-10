import Vehicle from './vehicle.js';
export default class Car extends Vehicle {
    numberOfDoors;
    static numberOfWheels = 4;
    steerWheel() {
        console.log('steering wheel...');
    }
    constructor(make, engineVolume, horsePower, color, model, priceBeforeTax, numberOfDoors) {
        super(make, engineVolume, horsePower, color, model, priceBeforeTax);
        this.numberOfDoors = numberOfDoors;
    }
}
