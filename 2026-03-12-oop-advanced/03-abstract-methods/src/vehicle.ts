// i can mark a class as an abstract class
// which means: this is not something tangible
// i will do this for classes that are intended ONLY FOR INHERITENCE
export default abstract class Vehicle {
    // members
    // if i want to have a member/funciton that is the same accross all instansiations,
    // then i declare them as "static"
    // "static" means it belongs to the class and not the the objects of the class
    static tax: number = 1.6
    protected customClerk: string = 'Moshe Israeli'
    private bakshishBeneficior: string = 'Shmulik Cohen'

    // methods 
    public setColor(color: string) {
        // pay the arists
        console.log(`paying the artist for changing ${this.make} color to ${color}`)

        // actually setting the color
        this.color = color
    }

    public getColor() {
        return this.color
    }


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
        return this.priceBeforeTax * Vehicle.tax
    }

    abstract peridocialMaintain(currentMileage: number): void 

    constructor (
        public readonly make: string, 
        public engineVolume: number, 
        public horsePower: number, 
        protected color: string, 
        public readonly model: number, 
        public priceBeforeTax: number) 
    {
        console.log(`baksish beneficior for this object is ${this.bakshishBeneficior}`)
    }
}