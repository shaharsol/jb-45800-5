// these are 3 sync commands, 
// each command starts executing ONLY AFTER 
// previous command finished
console.log(1)
console.log(2)
console.log(3)

// 5 will print AFTER 6, because printing of 5 is async
console.log(4)
setTimeout(() => console.log(5), 5 * 1000)
console.log(6)