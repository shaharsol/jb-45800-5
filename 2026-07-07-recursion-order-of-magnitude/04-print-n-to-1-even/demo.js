// a recursive function to print all the even numbers from n to 1

const printEvenNto1 = (n) => {
    if(n === 0) return
    if(n % 2 === 0) {
        console.log(n)
        printEvenNto1(n-2)
    } else {
        printEvenNto1(n-1)
    }
}

printEvenNto1(10)