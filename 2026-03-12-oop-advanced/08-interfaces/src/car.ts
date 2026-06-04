import ElectronicKey from './electronic-key.js'
import SpareWheel from './spare-wheel.js'
import Vehicle from './vehicle.js'

export default class Car extends Vehicle implements SpareWheel, ElectronicKey {
    numberOfDoors: number
    static readonly numberOfWheels: number = 4

    steerWheel() {
        console.log('steering wheel...')
    }

    constructor (make: string, engineVolume: number, horsePower: number, color: string, model: number, priceBeforeTax: number, numberOfDoors: number) {
        super(make, engineVolume, horsePower, color, model, priceBeforeTax) // super is a special way to invoke the ancestor constructor
        this.numberOfDoors = numberOfDoors
        // i can access protected members from within the inheritence hierarchy
        console.log(`this car custom clerk is ${this.customClerk}`)
        // but i i cannot access private members even from within the inheritence hierarchy
        // console.log(`this car bakshish beneficior is ${this.bakshishBeneficior}`)
    }
    weight: number
    voltage: number
    openVehicle(): void {
        console.log('opening car')
    }
    lockVehicle(): void {
        console.log('locking car')
    }
    wheelMake: string
    radius: number
    liftJack(): void {
        console.log('lifting jack')
    }
    replace(): void {
        console.log('replacing wheel')
    }
    lowerJack(): void {
        console.log('lowering jack')
    }

    peridocialMaintain(currentMileage: number): void {
        console.log(`making a ${currentMileage} maintence for ${this.make}`)
    }



}