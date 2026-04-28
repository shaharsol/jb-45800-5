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


// create a request handler
const requestHandler = (request, response) => {
    switch(request.url) {
        case '/health':
            response.end('healthy')
            break;
        case '/hello':
            response.end('hello')
            break;
        case '/users':
            response.end('users list....')
            break;
        default:
            response.writeHead(404)
            response.end('page not found 404')
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
