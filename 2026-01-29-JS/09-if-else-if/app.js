grade = +prompt('enter grade')

isTooBig = grade > 100
isTooSmall = grade < 0
isPass = grade > 60

if (isTooBig) {
    alert ('Invalid input, too big')
} else if (isTooSmall) {
    alert ('Invalid input, too small')
} else if (isPass) { 
    alert(`you passed`)
} else {
    alert(`you failed`)
}




