import Vehicle from './vehicle.js'

export default class Bike extends Vehicle{
    turnHandle(direction: string) {
        console.log(`turnded to the ${direction}`)
    }
}