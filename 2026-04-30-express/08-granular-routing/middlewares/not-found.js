const notFound = (request, response, next) => {
    next({
        status: 404,
        message: 'not found'
    })
}

module.exports = notFound