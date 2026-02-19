let a;
navigator.geolocation.getCurrentPosition(position => {
    console.log(position)
    a = position
    console.log(a)
})
console.log(a)
console.log('hello world')


const power = x => x**2

const myPower = power(4)
console.log(`myPower is ${myPower}`)


console.log(`a is ${a}`)

setTimeout(() => console.log(`a is ${a}`), 2000)