// import createServer function from the built in http package
const { createServer } = require('http')

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

const getUsers = (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(users))
}

const addUser = (request, response) => {
    console.log(request)
    response.end('added user...')
}

const unknownUserAction = (request, response) => {
    response.writeHead(405)
    response.end('method not supported!!!!')
}

const getProducts = (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(products))
}

const addProduct = (request, response) => {
    response.end('adding product....')
}

const notFound = (request, response) => {
    response.writeHead(404)
    response.end('page not found 404')
}

connectToMysql = (request, response) => {
    console.log('connecting to mysql...')
}

disconnectFromMysql = (request, response) => {
    console.log('disconnecting from mysql...')
}

connectToMongo = (request, response) => {
    console.log('connecting to mongo...')
}

disconnectFromMongo = (request, response) => {
    console.log('disconnecting from mongo...')
}

logRequest = (request, response) => {
    console.log(`request is... ${request.url}`)
}

// create a request handler
const requestHandler = (request, response) => {
    logRequest(request, response)
    switch(request.url) {
        case '/users':
            connectToMysql(request, response)
            switch(request.method) {
                case 'GET':
                    getUsers(request, response)
                    break;
                case 'POST':
                    addUser(request, response)
                    break;
                default:
                    unknownUserAction(request, response)
                    break;
            }
            disconnectFromMysql(request, response)
            break;
        case '/products':
            connectToMongo(request, response)
            switch(request.method) {
                case 'GET':
                    getProducts(request, response)
                    break;
                case 'POST':
                    addProduct(request, response)
                    break;
                default:
                    unknownUserAction(request, response)
                    break;
            }
            disconnectFromMongo(request, response)
            break;
        default:
            notFound(request, response)
            break;
    }
}

// create a server object
const server = createServer(requestHandler)

// start the server by listening on a
server.listen(port);

// notice: 
// when i program a server in Node.js
// all i do is to actually implement
// a single function: the request handler
