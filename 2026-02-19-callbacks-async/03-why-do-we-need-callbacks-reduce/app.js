// write the code for a function that
// gets an array of numbers as argument
// and returns the sum of the items in
// the array

function getArraySum(array) {
    let sum = 0
    for(const item of array) {
        sum += item
    }
    return sum
}

// write the code for a function that
// gets an array of numbers as argument
// and returns the multiplication of the items in
// the array
function getArrayMult(array) {
    let mul = 1
    for(const item of array) {
        mul *= item
    }
    return mul
}


function getArraySpecial(array) {
    let spe = 0
    for(const item of array) {
        spe += item ** 3
    }
    return spe
}

// to generalize the reduction algorithm
// i will use callbacks

function reduce(array, initialValue, callback) {
    let result = initialValue
    for (const item of array) {
        result = callback(item, result)
    }    
    return result
}

const sum = reduce([1,2,3,4], 0, function sum (currentItem, cumulativeValue) {
    return currentItem + cumulativeValue
})

const mul = reduce([1,2,3,4], 1, function sum (currentItem, cumulativeValue) {
    return currentItem * cumulativeValue
})

const spe = reduce([1,2,3,4], 0, function sum (currentItem, cumulativeValue) {
    return currentItem + cumulativeValue ** 3
})

console.log(`sum is ${sum}`)
console.log(`mul is ${mul}`)










// const sum = getArraySum([1,2,3,4])
// console.log(`sum is ${sum}`)

// const mul = getArrayMult([1,2,3,4])
// console.log(`mul is ${mul}`)