function getMax(arr) {
    // assume arr is an array of numbers > 0
    let max = 0;
    for(const current of arr) {
        if(current > max) {
            max = current
        }
    }
    return max
}

console.log(`max is ${getMax([99, 101, 44 ])}`)