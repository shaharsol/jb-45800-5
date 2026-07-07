// a recursive function to sum up all numbers between 1..n
// func(4) should return the result of 1+2+3+4=10

const getSumNto1 = (n) => {
    if(n === 0) return 0
    return n + getSumNto1(n - 1)  
}

const result = getSumNto1(4)
console.log(result)