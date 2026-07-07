// create a recursive function that receives a number n
// and prints all the number from n..1
// example: printNto1(10) should print: 10 9 8 7 6 5 4 3 2 1

const printNto1 = (n) => {
    if(n === 0) return
    console.log(n)
    printNto1(n-1)
}

printNto1(100000)