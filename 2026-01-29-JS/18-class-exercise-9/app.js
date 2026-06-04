sum = 0
counter = 0
number = +prompt('enter number')

while (number > 0) {
    sum = sum + number
    counter = counter + 1
    number = +prompt('enter number')
}

alert(sum / counter)


