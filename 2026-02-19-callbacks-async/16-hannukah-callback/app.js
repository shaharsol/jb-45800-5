// this is how i would do it in sync javascript
// const getHowManyCandlesPerDay = day => day + 1
// console.log(`number of candles on day 7 is ${getHowManyCandlesPerDay(7)}`)

// this is the same logic, implemented to mimic a server
const howManyCandlesPerDay = (day, callback) => {
    setTimeout(() => callback(day + 1), 1000)
}

// let sum = 0;
// // [1, 2, 3, 4, 5, 6, 7, 8].forEach(day => howManyCandlesPerDay(day, result => sum += result))
// for (const day of [1, 2, 3, 4, 5, 6, 7, 8]) {
//     howManyCandlesPerDay(day, result => sum += result)
// }

// console.log(`num of candles in hannukah is ${sum}`)


// callback hell
let sum = 0;
howManyCandlesPerDay(1, result => {
    sum += result
    howManyCandlesPerDay(2, result => {
        sum += result
        howManyCandlesPerDay(3, result => {
            sum += result
            howManyCandlesPerDay(4, result => {
                sum += result
                howManyCandlesPerDay(5, result => {
                    sum += result
                    howManyCandlesPerDay(6, result => {
                        sum += result
                        howManyCandlesPerDay(7, result => {
                            sum += result
                            howManyCandlesPerDay(8, result => {
                                sum += result
                                console.log(`number of candles is ${sum}`)
                            })
                        })
                    })
                })
            })
        })
    })
})
