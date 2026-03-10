import Vehicle from './vehicle.js'

export default class Car extends Vehicle{
    numberOfDoors: number
    static readonly numberOfWheels: number = 4

    steerWheel() {
        console.log('steering wheel...')
    }

    constructor (make: string, engineVolume: number, horsePower: number, color: string, model: number, priceBeforeTax: number, numberOfDoors: number) {
        super(make, engineVolume, horsePower, color, model, priceBeforeTax) // super is a special way to invoke the ancestor constructor
        this.numberOfDoors = numberOfDoors
    }

}