import Notifier from "./notifier.js";

export default class Discord extends Notifier {
    sendMessage(to: string, message: string): void {
        console.log(`sending the message via Discord to ${to}`)
    }

}