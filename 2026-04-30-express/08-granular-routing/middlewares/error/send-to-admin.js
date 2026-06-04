const sendAlertToAdmin = (err, request, response, next) => {
    if(err.status === 500) {
        console.log('sending alert to sys admin...')
    } else {
        console.log('the sendAlertToAdmin middleware has nothing to do...')
    }
    next(err)
}

module.exports = sendAlertToAdmin