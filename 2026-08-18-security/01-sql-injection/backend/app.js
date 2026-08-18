const express = require('express')
const mysql = require('mysql2/promise') ;

(async () => {

    const app = express()

    let db;

    app.post('/login', express.json() , async (req, res, next) => {
        const { username, password } = req.body
        
        const [ results ] = await db.query(`
            select 1
        `)

        console.log(results)
        
        
        res.json({success: true})
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

