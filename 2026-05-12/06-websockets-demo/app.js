const { Server } = require('socket.io')

const server = new Server({
    cors: {
        origin: '*'
    }
})

server.on('connection', socket => {
    console.log('new socket connection...')

    socket.on('disconnect', () => {
        console.log('socket disconnected...')
    })
})

server.listen(3004)