// lets say i have an app that needs to send messages to the users
// however, each user has another preferred way of receiving messages
// one user may prefer SMS messages
// another user may prefer email messages
// a third user may want to get messages via Discord

import getNotifier from "./factory.js"

const users = [
    {
        id: 1, 
        name: 'Liran',
        preferredNotificaitonChannel: 'Discord'
    }, {
        id: 2,
        name: 'Lidor',
        preferredNotificaitonChannel: 'Email'
    }, {
        id: 3, 
        name: 'Kirril',
        preferredNotificaitonChannel: 'Sms'
    }
]

const message = 'On saturday we are not open between 12:00-14:00 because renovation'

users.forEach(({name, preferredNotificaitonChannel}) => {
    const notifier = getNotifier(preferredNotificaitonChannel)
    notifier.sendMessage(name, message)
})

