const password = prompt('enter strong password')

// helper constants
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const allABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const digits = '0123456789'

if (password.length < 6 ) {
    alert('password is too short')
}

// let foundCapitalLetter = false
// for (const char of password) {
    
//     if (uppercaseLetters.includes(char) ) {
//         foundCapitalLetter = true
//         break
//     }
// }

// if (!foundCapitalLetter) {
//     alert('password must have at least one capital letter')
// }

if (password === password.toLowerCase()) {
    alert('password must have at least one capital letter')
}

if (password === password.toUpperCase()) {
    alert('password must have at least one lower case letter')
}

let hasSpecialChar = false
for(const char of password) {
    if(!allABC.includes(char)) {
        hasSpecialChar = true
    }
}

if(!hasSpecialChar) {
    alert('password must have at least one special char')
}


