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



// const main = async () => {
//     try {
//         const result = await howManyCandlesPerDayPromise(8)
//         console.log(result)
//     } catch (e) {
//         console.log(e)
//     }
// }

// main();

// IIFE - immediately invoked function expression
(async () => {
    try {
        const result = await howManyCandlesPerDayPromise(8)
        console.log(result)
    } catch (e) {
        console.log(e)
    }
})()