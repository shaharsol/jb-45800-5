import express from 'express'
import config from 'config'

const port = config.get<number>('app.port')
const name = config.get<string>('app.name')

const app = express()

app.get('/health', (request, response) => {
    response.json({ status: 'ok' })
})

app.listen(port, () => console.log(`app ${name} started on port ${port}....`))
