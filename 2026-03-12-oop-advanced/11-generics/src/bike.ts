import Vehicle from "./vehicle.js";

export default class Bike extends Vehicle {
    constructor(public make: string, public model: number) {
        super()
    }
}