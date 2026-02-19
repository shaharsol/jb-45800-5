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

let sum = 0;
howManyCandlesPerDayPromise(1)
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(2)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(3)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(4)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(5)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(6)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(7)
    })
    .then(result => { 
        sum += result
        return howManyCandlesPerDayPromise(8)
    })
    .then(result => { 
        sum += result
        console.log(sum)
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))