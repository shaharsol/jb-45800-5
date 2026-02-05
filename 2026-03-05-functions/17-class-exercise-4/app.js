function printPrice(price) {
    console.log(`welcome to country north, please pay ${price}`)
}

const age = +prompt('enter your age')

if (age <= 6) {
    printPrice(0)
} else if (age <12) {
    printPrice(20)
} else if (age <18) {
    printPrice(50)
} else if (age <65) {
    printPrice(100)
} else {
    printPrice(0)
}




