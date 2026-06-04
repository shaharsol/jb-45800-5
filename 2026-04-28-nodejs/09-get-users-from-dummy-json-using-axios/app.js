// const response = await fetch('https://dummyjson.com/users')
// const { users } = await response.json()

// the original method to import/export code in Node.js
// was called CommonJS


(async() => {
    const axios = require('axios')
    const { sum } = require('./calc')
    const { data: {users}} = await axios('https://dummyjson.com/users')
    console.log(users.map(({firstName, lastName}) => `${firstName} ${lastName}`).join('\n'))
    console.log(`2 + 3 = ${sum(2,3)}`)
})()
