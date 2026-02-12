function getMinAndMax(arr) {
    // assume arr is an array of numbers > 0
    let max = 0;
    let min = Infinity
    for(const current of arr) {
        if(current > max) {
            max = current
        }
        if (current < min) {
            min = current
        }
    }
    // to return a composite value from a function
    // best method is to return an object
    return {
        min: min,
        max: max
    }
}

const minAndMax = getMinAndMax([99, 101, 44])
console.log(`max is ${minAndMax.max} and min is ${minAndMax.min}`)