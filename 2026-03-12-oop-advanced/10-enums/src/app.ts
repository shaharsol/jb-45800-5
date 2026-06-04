// lets say i have an app that needs to send messages to the users
// however, each user has another preferred way of receiving messages
// one user may prefer SMS messages
// another user may prefer email messages
// a third user may want to get messages via Discord

import getNotifier from "./factory.js"
import NotificationChannels from "./notification-channels.js"

interface User {
    id: number,
    name: string,
    preferredNotificaitonChannel: NotificationChannels
}

const users: User[] = [
    {
        id: 1, 
        name: 'Liran',
        preferredNotificaitonChannel: NotificationChannels.Discord
    }, {
        id: 2,
        name: 'Lidor',
        preferredNotificaitonChannel: NotificationChannels.Email
    }, {
        id: 3, 
        name: 'Kirril',
        preferredNotificaitonChannel: NotificationChannels.SMS
    }, {
        id: 4,
        name: 'X Æ A-Xii', // there are infinite options for name, i can never predict a new name
        preferredNotificaitonChannel: NotificationChannels.SMS // there is an finite set of possible options (sms/discord/email/twitter/phone)
    }, {
        id: 5,
        name: 'shlomit',
        preferredNotificaitonChannel: NotificationChannels.Twitter
    }
]

const message = 'On saturday we are not open between 12:00-14:00 because renovation'

users.forEach(({name, preferredNotificaitonChannel}) => {
    console.log(`${name} preferred channel is ${preferredNotificaitonChannel}`)
    const notifier = getNotifier(preferredNotificaitonChannel)
    notifier.sendMessage(name, message)
})

