const respondToUserWithError = (err, request, response, next) => {
    // response.writeHead(err.status || 500)
    // response.end(err.message || 'there was an error...')
    response.status(err.status || 500).end(err.message || 'there was an error...')
}

module.exports = respondToUserWithError