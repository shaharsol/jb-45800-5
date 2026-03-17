export default class Backup<T>{

    constructor (
        public subject: string,
        public value: T
    ) {

    }

    display() {
        // console.log(`subject is ${this.subject}`)
        // console.log(`value is ${this.value}`)
        console.log(this.subject, this.value)
    }

}