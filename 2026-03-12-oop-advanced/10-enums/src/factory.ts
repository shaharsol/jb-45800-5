import Discord from "./discord.js"
import Email from "./email.js";
import NotificationChannels from "./notification-channels.js";
import Notifier from "./notifier.js"
import Sms from "./sms.js";

export default function getNotifier(notifier: NotificationChannels): Notifier {
    switch (notifier) {
        case NotificationChannels.Discord:
            return new Discord()
            break;
        case NotificationChannels.Email:
            return new Email()
            break;
        case NotificationChannels.SMS: 
        default:
            return new Sms()
            break;
    }
}