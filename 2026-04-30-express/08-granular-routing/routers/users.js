const express = require('express')
const { connectToMysql, disconnectFromMysql, getUsers, addUser, unknownUserAction }  = require('../controllers/users')

// data, imagine it comes from database




const router = express.Router()

router.use('/', express.json())
router.use('/', connectToMysql)
router.get('/', getUsers)
router.post('/', addUser)
router.delete('/', unknownUserAction)
router.patch('/', unknownUserAction)
router.use('/', disconnectFromMysql)

module.exports = router


