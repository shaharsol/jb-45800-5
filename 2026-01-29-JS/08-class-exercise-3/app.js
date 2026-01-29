grade = +prompt('enter grade')

isNotValid = grade > 100

if (isNotValid) {
    alert ('Invalid input')
} else {
    isPass = grade > 60
    if (isPass) { 
        alert(`you passed`)
    } else {
        alert(`you failed`)
    }

}


