const logErrorMiddleware = (err, request, response, next) => {
    console.log(err)
    next(err)
}

module.exports = logErrorMiddleware