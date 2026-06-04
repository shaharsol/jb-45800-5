export default class Vehicle {
    // in every class we will find a list of members:
    readonly make: string 
    engineVolume: number
    horsePower: number
    protected color: string
    readonly model: number
    priceBeforeTax: number

    // and then a consturctor that initialized these members:
    constructor (make: string, engineVolume: number, horsePower: number, color: string, model: number, priceBeforeTax: number) {
        this.make = make 
        this.engineVolume = engineVolume
        this.horsePower = horsePower
        this.color = color
        this.model = model
        this.priceBeforeTax = priceBeforeTax
    }
}