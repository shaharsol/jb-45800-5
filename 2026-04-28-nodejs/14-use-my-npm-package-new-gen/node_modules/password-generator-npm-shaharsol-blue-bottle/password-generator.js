const generatePassword = (length, useSpecialChars = false) => {
    const regularCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const specialChars = '!@#$%^&*()'

    const charsToUse = useSpecialChars ? regularCharacters + specialChars : regularCharacters
    let password = '';

    for(let i=0; i < length; i++) {
        password += charsToUse[Math.floor(Math.random() * charsToUse.length)]
    }

    return password

}

module.exports = {
    generatePassword
}