const express = require('express')

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


const getProducts = (request, response, next) => {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(products))
}

const addProduct = (request, response, next) => {
    response.end('adding product....')
}

connectToMongo = (request, response, next) => {
    console.log('connecting to mongo...')
    next()
}

disconnectFromMongo = (request, response, next) => {
    console.log('disconnecting from mongo...')
    next()
}

router = express.Router()

router.use('/', connectToMongo)
router.get('/', getProducts)
router.post('/', addProduct)
router.use('/', disconnectFromMongo)


module.exports = router