import Vehicle from "./vehicle.js";

export default class Car extends Vehicle {
    constructor(public make: string, public model: number) {
        super()
    }
}