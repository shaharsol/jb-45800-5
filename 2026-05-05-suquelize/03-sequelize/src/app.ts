import express from 'express'
import logError from './middlewares/error/log-error'
import config from 'config'
import respondError from './middlewares/error/error-responder'
import notFound from './middlewares/not-found'
import profileRouter from './routers/profile'
import feedRouter from './routers/feed'

const port = config.get<number>('app.port')
const name = config.get<string>('app.name')


const app = express()

// middlewares
app.use('/profile', profileRouter)
app.use('/feed', feedRouter)
app.use('/', notFound)

// error middlewares
app.use('/', logError)
app.use('/', respondError)

// starting the server
app.listen(port, () => console.log(`app ${name} started on port ${port}....`))