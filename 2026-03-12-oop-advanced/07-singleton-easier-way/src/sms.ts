import Notifier from "./notifier.js";

export default class Sms extends Notifier {

    static instance: Sms = new Sms()

    public static getInstance(): Sms {
        return Sms.instance
    }

    sendMessage(to: string, message: string): void {
        console.log(`sending the message via SMS to ${to}`)
    }

    private constructor () {
        super()
        console.log('creating a new SMS notifier obejct')
    }

}