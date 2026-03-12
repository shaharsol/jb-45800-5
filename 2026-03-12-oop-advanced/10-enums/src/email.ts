import Notifier from "./notifier.js";

export default class Email extends Notifier {
    sendMessage(to: string, message: string): void {
        console.log(`sending the message via Email to ${to}`)
    }

}