const express = require('express')
const axios = require('axios')
const { toXML } = require('jstoxml')

// realize port
const port = process.env.PORT || 3000


const getUsers = async (request, response, next) => {

    try {
        // get users from some rest server
        const { data: { users } } = await axios('https://dummyjson.com/users')

        // filter users
        let filteredList = users
        if(request.query.filter) {
            filteredList = filteredList.filter(({firstName}) => firstName.includes(request.query.filter))
        }

        console.log(`length of list is ${filteredList.length}`)

        // respond according to format
        if(request.query.format === 'xml') {
            response.setHeader('Content-Type', 'application/xml')
            response.end(toXML(filteredList))
        } else {
            // express is considerate enough to provide
            // us with powerful utilities
            // for example we can change this:
            // response.setHeader('Content-type', 'application/json')
            // response.end(JSON.stringify(filteredList))
            // to:
            response.json(filteredList)
        }


    } catch (e) {
        next(e)        
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

app.get('/users', getUsers)
app.use('/', notFound)

// error middlewares
app.use('/', logErrorMiddleware)
app.use('/', sendAlertToAdmin)
app.use('/', respondToUserWithError)

app.listen(port, () => {
    console.log(`server started on port ${port}...`)
})
