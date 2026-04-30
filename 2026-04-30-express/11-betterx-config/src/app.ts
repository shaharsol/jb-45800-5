import express from 'express'
import logError from './middlewares/error/log-error'
import config from 'config'

const port = config.get<number>('app.port')
const name = config.get<string>('app.name')

const app = express()


app.use('/', logError)


app.listen(port, () => console.log(`app ${name} started on port ${port}...`))