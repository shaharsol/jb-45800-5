import Vehicle from './vehicle.js'

export default class Bike extends Vehicle{
    peridocialMaintain(currentMileage: number): void {
        console.log('maintaining the bike')
    }
    turnHandle(direction: string) {
        console.log(`turnded to the ${direction}`)
    }
}