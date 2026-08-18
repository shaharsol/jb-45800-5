const axios = require('axios');

(async() => {

    const SIZE = 100

    const array = Array.from({ length: SIZE }, (value, index) => index);
    const requests = []
    
    array.forEach(item => requests.push(axios('http://localhost:3000/product/1')))

    const results = await Promise.all(requests)

    console.log(results)

})()