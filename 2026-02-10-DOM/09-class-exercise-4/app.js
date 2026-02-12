function isStartsWith(str, char) {
    return str[0] === char
}

console.log(`${isStartsWith('Israel', 'I') ? 'yes' : 'no'}`)
console.log(`${isStartsWith('Israel', 't') ? 'yes' : 'no'}`)