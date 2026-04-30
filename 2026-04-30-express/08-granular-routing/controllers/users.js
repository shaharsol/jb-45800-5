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

const getUsers = (request, response, next) => {
    // response.setHeader('Content-Type', 'application/json')
    // response.end(JSON.stringify(users))
    response.json(users)
}

const addUser = (request, response, next) => {
    // do something in mysql
    // which means, i need the mysql connection
    console.log(`i have this mysql connection`,request.mysqlConnection)
    response.end('added user...')
    next()
}

const unknownUserAction = (request, response, next) => {
    // response.writeHead(405)
    // response.end('method not supported!!!!')
    response.status(405).end('method not supported!!!!')
}


const connectToMysql = (request, response, next) => {
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

const disconnectFromMysql = (request, response, next) => {
    console.log('disconnecting from mysql...')
}

module.exports = {
    getUsers,
    addUser,
    unknownUserAction,
    connectToMysql,
    disconnectFromMysql
}