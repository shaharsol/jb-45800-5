import Notifier from "./notifier.js";

export default class Sms extends Notifier {
    sendMessage(to: string, message: string): void {
        console.log(`sending the message via SMS to ${to}`)
    }

}