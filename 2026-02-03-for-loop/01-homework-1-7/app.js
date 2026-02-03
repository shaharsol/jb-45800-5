num1 = +prompt('enter number 1')
num2 = +prompt('enter number 2')
num3 = +prompt('enter number 3')

if (num1 > num2) {
    if(num1 > num3) {
        alert(`max is ${num1}`)
    } else {
        alert(`max is ${num3}`)
    }
} else {
    if(num2 > num3) {
        alert(`max is ${num2}`)
    } else {
        alert(`max is ${num3}`)
    }
}