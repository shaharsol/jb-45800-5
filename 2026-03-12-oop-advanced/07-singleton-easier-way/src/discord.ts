import Notifier from "./notifier.js";

class Discord extends Notifier {
    sendMessage(to: string, message: string): void {
        console.log(`sending the message via Discord to ${to}`)
    }
}

const discord = new Discord()
export default discord 