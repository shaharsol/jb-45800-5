const express = require('express')
const axios = require('axios')
const { toXML } = require('jstoxml')

// realize port
const port = process.env.PORT || 3000


const getUsers = async (request, response, next) => {

    try {
        // get users from some rest server
        const { data: { users } } = await axios('https://dummyjson.com/users')
        request.users = users
        next()

    } catch (e) {
        next(e)        
    }


}

const filterUsers = (request, response, next) => {
        let filteredList = request.users
        if(request.query.filter) {
            filteredList = filteredList.filter(({firstName}) => firstName.includes(request.query.filter))
        }
        request.users = filteredList
        next()
}

const respond = (request, response, next) => {

        // respond according to format
        if(request.query.format === 'xml') {
            response.setHeader('Content-Type', 'application/xml')
            response.end(toXML(request.users))
        } else {
            // express is considerate enough to provide
            // us with powerful utilities
            // for example we can change this:
            // response.setHeader('Content-type', 'application/json')
            // response.end(JSON.stringify(filteredList))
            // to:
            response.json(request.users)
        }
}

const notFound = (request, response, next) => {
    next({
        status: 404,
        message: 'not found'
    })
}


logErrorMiddleware = (err, request, response, next) => {
    console.log(err)
    next(err)
}

sendAlertToAdmin = (err, request, response, next) => {
    if(err.status === 500) {
        console.log('sending alert to sys admin...')
    } else {
        console.log('the sendAlertToAdmin middleware has nothing to do...')
    }
    next(err)
}

respondToUserWithError = (err, request, response, next) => {
    response.writeHead(err.status || 500)
    response.end(err.message || 'there was an error...')
}


const app = express()

// express allows us to mount multiple routers in a single command
// app.get('/users', getUsers)
// app.get('/users', filterUsers)
// app.get('/users', respond)
app.get('/users', getUsers, filterUsers, respond)
app.use('/', notFound)

// error middlewares
app.use('/', logErrorMiddleware)
app.use('/', sendAlertToAdmin)
app.use('/', respondToUserWithError)

app.listen(port, () => {
    console.log(`server started on port ${port}...`)
})
