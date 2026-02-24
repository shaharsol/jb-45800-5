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

// the following thenification code is still not so very clear to 
// the human eye, because of extensive use of callbacks
// both then and catch require callbacks...
// let sum = 0;
// howManyCandlesPerDayPromise(1)
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(2)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(3)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(4)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(5)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(6)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(7)
//     })
//     .then(result => { 
//         sum += result
//         return howManyCandlesPerDayPromise(8)
//     })
//     .then(result => { 
//         sum += result
//         console.log(sum)
//     })
//     .then(result => console.log(result))
//     .catch(error => console.log(error))


// so in 2017, a new syntax was presented, widely known
// as async/await

howManyCandlesPerDayPromise(8)
    .then(candles => console.log(candles))
    .catch(error => console.log(error))

howManyCandlesPerDayPromise(9)
    .then(candles => console.log(candles))
    .catch(error => console.log(error))

// the same code with async/await style:
// the idea is that i can assign the promise resolution into a variable

const printCandles = async () => {
    const candles = await howManyCandlesPerDayPromise(8)
    console.log(candles)
}

printCandles()

// this is an async function
// you can use the "await" keyword inside it
// if an async function returns a value
// the value will ALWAYS be a promise
const calcHannukahAsyncAwait = async () => {
    let sum = 0
    sum += await howManyCandlesPerDayPromise(1)
    sum += await howManyCandlesPerDayPromise(2)
    sum += await howManyCandlesPerDayPromise(3)
    sum += await howManyCandlesPerDayPromise(4)
    sum += await howManyCandlesPerDayPromise(5)
    sum += await howManyCandlesPerDayPromise(6)
    sum += await howManyCandlesPerDayPromise(7)
    sum += await howManyCandlesPerDayPromise(8)
    sum += await howManyCandlesPerDayPromise(9)
    console.log(sum)
    return 'success'
}

// in order to catch errors, the same way i used to promise.catch
// there is another syntax:
const main = async () => {
    try {
        const result = await calcHannukahAsyncAwait()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

// to sum up: whenever we use "await" we must have a try/catch block


main()




