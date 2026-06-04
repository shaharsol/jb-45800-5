// the basic enum values are the same as array offsets
// enum NotificationChannels {
//     SMS,
//     Email,
//     Discord,
//     Twitter
// }

// however, with longer lists, and usually even with short lists
// it is better to a assign a string literal to any of the enum values
// for better human understanding (i.e. reading logs):
enum NotificationChannels {
    SMS = 'SMS',
    Email = 'Email',
    Discord = 'Discord',
    Twitter = 'Twitter'
}


export default NotificationChannels