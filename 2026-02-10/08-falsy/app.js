const someBoolean = 300 * 4 === 1200

if(someBoolean) {
    console.log('equals')
} else {
    console.log('NOT equals')
}

let someUserInput
if (typeof someUserInput !== 'undefined') {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

// javascript saved us from coding this long comparison everytime
// and treat any value as boolean value
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = 'aaa'
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = ''
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = ' '
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = 100
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = 0
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}


someUserInput = -1
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = {}
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}

someUserInput = null
if (someUserInput) {
    console.log('input is valid')
} else {
    console.log('input is NOT valid')
}
