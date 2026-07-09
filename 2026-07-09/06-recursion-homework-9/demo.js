// non recursive solution
// const isPolindrom = (value) => {
//     return value === value.split('').reverse().join('')
// }


// abcba
// bcb
// c

const isPolyndrom = (value) => {
    if(value === '') return true
    if(value.length === 1) return true
    const leftChar = value[0]
    const rightChar = value[value.length - 1]

    if(leftChar !== rightChar) return false

    return isPolyndrom(value.substring(1, value.length - 1))

}


console.log(`${process.argv[2]} is ${isPolyndrom(process.argv[2]) ? '' : 'not'} polyndrom`)