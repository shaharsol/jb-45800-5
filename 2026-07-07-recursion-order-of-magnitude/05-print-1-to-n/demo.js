// create a recursive function to print all numbers 
// between 1..n
// if i invoke func(4), output should be: 1 2 3 4

const print1toN = (n) => {
    if(n === 0) return
    print1toN(n-1)
    console.log(n)
}

print1toN(10)