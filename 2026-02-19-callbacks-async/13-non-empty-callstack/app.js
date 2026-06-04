console.log(1)
setTimeout(()=>{
    console.log(2)
    console.log((new Date()).toLocaleTimeString())
}, 3 * 1000)
console.log((new Date()).toLocaleTimeString())
console.log(3)
let sum = 0;
for(let i=0; i < 1000000000; i++) {
    sum += i;
}
