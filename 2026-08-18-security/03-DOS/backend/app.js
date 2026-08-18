import express from 'express'
import mysql from 'mysql2/promise'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'

(async () => {
    const app = express()
    
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
        // store: ... , // Redis, Memcached, etc. See below.
    })

    // Apply the rate limiting middleware to all requests.
    app.use(morgan('dev'))
    app.use(limiter)

    let db;

    app.post('/login', express.json() , async (req, res, next) => {
        const { username, password } = req.body
        
        // this sqlQuery allows SQL injection
        // as it renders user data inside a sql template
        // without escaping the user input
        // const sqlQuery = "select id from users where username = '" + username + "' and password = '" + password + "'"

        const sqlQuery = "select id from users where username = ? and password = ?"

        console.log(sqlQuery)

        const [ results ] = await db.query(sqlQuery, [username, password])

        console.log(results)
        
        if (results.length === 0) {
            res.status(401).send('no such user')
        } else {
            res.json(results)
        }
        
    })

    app.get('/product/:id', async (req, res, next) => {

        const userId = 2; // assume i get this data from the request after successful authentication

        const sqlQuery = `
            select * from products where id = ? and user_id = ?
        `

        /*
        if it was sequelzie.

        // this is wrong. it allows everyone to see the product
        const product = Product.findByPK(req.params.id)

        // this is right, it limits the product view only
        // to the product owner
        const product = Product.findOne({where:{
            productId: req.params.id,
            userId
        }})
        */

        const [ results ] = await db.query(sqlQuery, [req.params.id, userId])

        res.json(results)

    })


    app.post('/product', express.json(), async (req, res, next) => {
        const userId = 2;
        const {name, price} = req.body
        const sqlQuery = `
            insert into products(user_id, name, price)
            values(?, ?, ?)
        `
        const [ results ] = await db.query(sqlQuery, [userId, name, price])

        res.json(results)

    })

    db = await mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'root',
        database: 'sec1',
    });

    app.listen(3000, () => {
        console.log('app started on port 3000')
    })
})()




/*

bob000
' or 1=1 -- 
' or 1=1; drop table products; -- 
*/