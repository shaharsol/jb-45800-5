const express = require('express')

// realize port
const port = process.env.PORT || 3000

// data, imagine it comes from database
const users = [
    {
        id: 1,
        name: 'Shlomo'
    },
    {
        id: 2,
        name: 'Cammal'
    },
    {
        id: 3,
        name: 'Alex'
    }
]

const products = [
    {
        id: 1,
        name: 'iPhone 17+'
    },
    {
        id: 2,
        name: 'Huawei Block 12'
    },
    {
        id: 3,
        name: 'Xiomi Xio 3'
    }
]

const getUsers = (request, response, next) => {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(users))
}

const addUser = (request, response, next) => {
    // do something in mysql
    // which means, i need the mysql connection
    console.log(`i have this mysql connection`,request.mysqlConnection)
    response.end('added user...')
    next()
}

const unknownUserAction = (request, response, next) => {
    response.writeHead(405)
    response.end('method not supported!!!!')
}

const getProducts = (request, response, next) => {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(products))
}

const addProduct = (request, response, next) => {
    response.end('adding product....')
}

const notFound = (request, response, next) => {
    next({
        status: 404,
        message: 'not found'
    })
}

connectToMysql = (request, response, next) => {
    // any query param that is passed by the client in the url
    // is automatically parsed for my convenience in express
    // into the request.query object
    console.log(request.query.format)
    console.log(request.query.usersInPage)
    console.log('connecting to mysql...')
    const mysqlConnection = { version: 5.1 }
    // express error handling
    // a call to next() from a middleware reports to express
    // that this middleware has finished processing and it's now
    // the turn of the next middleware
    // in order to pass information from middleware to middleware
    // i load the request object with data
    request.mysqlConnection = mysqlConnection
    next()
    // next({ 
    //     status: 500,
    //     message: 'database is offline'
    // })

    // however, if there was an error during this middleware
    // i can report it to express using:
    // next(anyObject)
    // in other words, if i pass anything to the next function
    // then this anything must be an error
    // next({
    //      error: 'database is offline'     
    // })
    // when i invoke next with a parameter, express looks to invoke
    // the 1st error middelware it finds
    // an error middleware is a middleware with 4 arguments in the function signature
}

disconnectFromMysql = (request, response, next) => {
    console.log('disconnecting from mysql...')
}

connectToMongo = (request, response, next) => {
    console.log('connecting to mongo...')
}

disconnectFromMongo = (request, response, next) => {
    console.log('disconnecting from mongo...')
}

logRequest = (request, response, next) => {
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

// i am going to load functions on routes
// a route can be generic: /users
// which means "any path that starts with /users: /users, /users/123, /users/new"
// and it can be specific
// which means /users/123
// to use generic routes we use the 'use' function
// to use specific routes we use a specific html command function


app.use('/', express.json())
app.use('/', logRequest)
app.use('/users', connectToMysql)
app.get('/users', getUsers)
app.post('/users', addUser)
app.delete('/users', unknownUserAction)
app.patch('/users', unknownUserAction)
app.use('/users', disconnectFromMysql)
app.use('/products', connectToMongo)
app.get('/products', getProducts)
app.post('/products', addProduct)
app.delete('/products', unknownUserAction)
app.patch('/products', unknownUserAction)
app.use('/products', disconnectFromMongo)
app.use('/', notFound)

// error middlewares
app.use('/', logErrorMiddleware)
app.use('/', sendAlertToAdmin)
app.use('/', respondToUserWithError)

app.listen(port, () => {
    console.log(`server started on port ${port}...`)
})
