const express = require('express')
const mysql = require('mysql2/promise') ;

(async () => {

    const app = express()

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