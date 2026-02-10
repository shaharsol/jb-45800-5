const str = 'abcbaAAA'
const str2 = 'cba'
const str3 = 'baa'

// upper case
console.log(str.toUpperCase())

// lower case
console.log(str.toLowerCase())

// is starting with?
console.log(str.startsWith('I'))
console.log(str.startsWith('a'))

// is ending with?
console.log(str.endsWith('I'))
console.log(str.endsWith('A'))

// does a string contains another string
console.log(str.includes(str2))
console.log(str.includes(str3))

// what is the location of x string in y?
console.log(str.indexOf(str2))
console.log(str.indexOf(str3))

// many times we need to cut a string out of a string
const sentence = 'come on to United states of america man we can have a lot of fun'
console.log(sentence.substring(10,16))
console.log(sentence.substring(sentence.indexOf('to') + 3, sentence.indexOf('man') -1))

const str4 = '   Russia is a great  country  '
console.log(str4)
console.log(str4.trim())



