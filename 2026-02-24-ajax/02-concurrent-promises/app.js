// this is how i would do it in sync javascript
// const getHowManyCandlesPerDay = day => day + 1
// console.log(`number of candles on day 7 is ${getHowManyCandlesPerDay(7)}`)

// this is the same logic, implemented to mimic a server
const howManyCandlesPerDay = (day, callback) => {
    setTimeout(() => callback(day + 1), 1000)
}

const howManyCandlesPerDayPromise = (day) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (day < 1 || day > 8) {
                reject('day input is invalid')
            } else {
                resolve(day + 1)
            }
        }, 1000)
    })
}


// to run many promises in parallel, i can use Promise.all
// Promise.all accepts an array of promises as argument, it invokes the then with an array of results
// each item in the result, is the result of the ordinal promise according to the original promises array order
const promises = [
    howManyCandlesPerDayPromise(1),
    howManyCandlesPerDayPromise(2),
    howManyCandlesPerDayPromise(3),
    howManyCandlesPerDayPromise(4),
    howManyCandlesPerDayPromise(5),
    howManyCandlesPerDayPromise(6),
    howManyCandlesPerDayPromise(7),
    howManyCandlesPerDayPromise(8),
    // howManyCandlesPerDayPromise(9),
]

console.log(promises)
 Promise.all(promises)
    .then(results => console.log(results))
    .catch(error => console.log(error))