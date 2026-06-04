// import createServer function from the built in http package
const { createServer } = require('http')

// realize port
const port = process.env.PORT || 3000

// create a request handler
const requestHandler = (request, response) => {
    switch(request.url) {
        case '/health':
            response.end('healthy')
            break;
        case '/hello':
            response.end('hello')
            break;
        default:
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
