export default class Car {
    // members
    readonly make: string // readonly means that no assigment is possible into this member, unless via the constructor
    engineVolume: number
    horsePower: number
    color: string
    readonly model: number
    priceBeforeTax: number
    // if i want to have a member/funciton that is the same accross all instansiations,
    // then i declare them as "static"
    // "static" means it belongs to the class and not the the objects of the class
    static tax: number = 1.6

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
        // i can modify the readonly member ONLY inside the constructor
        // this.make = 'fvdfgdfs' 
        console.log(`${this.make} phphphphphph`)
    }

    getPriceIncludingTax() {
        // static memebrs and functions are accessed via the class and not via an object
        return this.priceBeforeTax * Car.tax
    }

    constructor (make: string, engineVolume: number, horsePower: number, color: string, model: number, priceBeforeTax: number) {
        this.make = make // this is the only place where i can assign a value to a readonly member
        this.engineVolume = engineVolume
        this.horsePower = horsePower
        this.color = color
        this.model = model
        this.priceBeforeTax = priceBeforeTax
    }
}