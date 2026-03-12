export default class Vehicle {

    static tax = 18
    // with typescript i can shorthand the entire members/constructor phase
    // by simply putting the access modifiers (private/protected/public) in the constructor argument list
    // if an argument in the constructor has an access modifier, it means:
    // 1. i want it to be a member of the class (in an invisible way)
    // 2. i want to initialize it (in an invisible way)
    constructor (
        public make: string, 
        public engineVolume: number, 
        public readonly horsePower: number, 
        protected color: string, 
        private model: number, 
        public priceBeforeTax: number
    ) {
        console.log('constructing a new vehicle')
        console.log(`tax for all vehicles is ${Vehicle.tax}`)
    }
}