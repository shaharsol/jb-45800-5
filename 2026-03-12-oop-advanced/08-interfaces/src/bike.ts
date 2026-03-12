import SpareWheel from './spare-wheel.js'
import Vehicle from './vehicle.js'

export default class Bike extends Vehicle implements SpareWheel{
    radius: number
    wheelMake: string
    liftJack(): void {
        console.log('lifting center bike jack')
    }
    replace(): void {
        console.log('replacing bike wheel')
    }
    lowerJack(): void {
        console.log('lowering jack')
    }
    peridocialMaintain(currentMileage: number): void {
        console.log('maintaining the bike')
    }
    turnHandle(direction: string) {
        console.log(`turnded to the ${direction}`)
    }
}