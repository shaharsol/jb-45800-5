const { generatePassword } = require('./password-generator')

// 10 chars, no special chars
console.log(generatePassword(10))

// 10 chars, with special chars
console.log(generatePassword(10, true))