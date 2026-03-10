export default class Car {
    // members
    make; // readonly means that no assigment is possible into this member, unless via the constructor
    engineVolume;
    horsePower;
    color;
    model;
    // methods 
    drive() {
        // i need a way to refer to an actual object
        // instansiated from this class, within the class
        // the way to do it, is by using the word: this
        console.log(`${this.make} voom voom`);
    }
    break() {
        console.log(`${this.make} heheheheyyyyywwww`);
    }
    ignite() {
        // i can modify the readonly member ONLY inside the constructor
        // this.make = 'fvdfgdfs' 
        console.log(`${this.make} phphphphphph`);
    }
    constructor(make, engineVolume, horsePower, color, model) {
        this.make = make; // this is the only place where i can assign a value to a readonly member
        this.engineVolume = engineVolume;
        this.horsePower = horsePower;
        this.color = color;
        this.model = model;
    }
}
