import express from 'express'
import sayHello from './middlewares/say-hello'
// import logRequest from './middlewares/log-request.js'
// import logError from './middlewares/log-request.js'
// import sayHello from './middlewares/say-hello.js'

const port = process.env.PORT || 3000

const app = express()

// app.use('/', logRequest)
app.get('/', sayHello)

// app.use('/', logError)


app.listen(port)