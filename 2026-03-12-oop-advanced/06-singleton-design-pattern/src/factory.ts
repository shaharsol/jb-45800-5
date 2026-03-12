import Discord from "./discord.js"
import Email from "./email.js";
import Notifier from "./notifier.js"
import Sms from "./sms.js";

export default function getNotifier(notifier: string): Notifier {
    switch (notifier) {
        case 'Discord':
            return new Discord()
            break;
        case 'Email':
            return new Email()
            break;
        case 'Sms': 
        default:
            // return new Sms()
            return Sms.getInstance()
            break;
    }
}