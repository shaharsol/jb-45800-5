export default class Car {
    // members
    make: string
    engineVolume: number
    horsePower: number
    color: string
    model: number

    // methods 
    drive() {

        // i need a way to refer to an actual object
        // instansiated from this class, within the class
        // the way to do it, is by using the word: this

        console.log(`${this.make} voom voom`)
    }

    break() {
        console.log(`${this.make} heheheheyyyyywwww`)
    }

    ignite() {
        console.log(`${this.make} phphphphphph`)
    }

    constructor (make: string, engineVolume: number, horsePower: number, color: string, model: number) {
    // constructor (make: string, engineVolume: number) {
        this.make = make
        this.engineVolume = engineVolume
        this.horsePower = horsePower
        this.color = color
        this.model = model
    }
}