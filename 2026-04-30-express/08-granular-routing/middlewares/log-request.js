const logRequest = (request, response, next) => {
    // if i load the express.json middleware
    // then it will do the following
    // check the headers to see if this is an application/json
    // request
    // if no, it will simply next()
    // if yes, it will extract all post data into request.body
    console.log(request.body)
    console.log(`request is... ${request.url}`)
    next()
}

module.exports = logRequest