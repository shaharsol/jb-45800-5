const express = require('express')
const usersRouter = require('./routers/users')
const productsRouter = require('./routers/products')
const notFound = require('./middlewares/not-found')
const logRequest = require('./middlewares/log-request')
const logErrorMiddleware = require('./middlewares/error/log-error')
const sendAlertToAdmin = require('./middlewares/error/send-to-admin')
const respondToUserWithError = require('./middlewares/error/respond')
// realize port
const port = process.env.PORT || 3000

const app = express()

app.use('/', logRequest)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/', notFound)

// error middlewares
app.use('/', logErrorMiddleware)
app.use('/', sendAlertToAdmin)
app.use('/', respondToUserWithError)

app.listen(port, () => {
    console.log(`server started on port ${port}...`)
})
