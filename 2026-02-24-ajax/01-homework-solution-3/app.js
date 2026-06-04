const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pizzas = []

for(let i=1 ; i <= 20; i++) {
    pizzas.push({
        diameter: getRandomInt(10, 40),
        slices: getRandomInt(4, 8),
        toppings: getRandomInt(0, 4), 
        price: getRandomInt(20, 90)
    })
}

console.log(pizzas)


// 1st pizza cheaper than 30
console.log(pizzas.find(pizza => pizza.price < 30))

// all pizzas with diameter under 20
console.log(pizzas.filter(pizza => pizza.diameter < 20))

// pizza prices including VAT
console.log(pizzas.map(pizza => {
    return {
        originalPrice: pizza.price,
        includingVAT: pizza.price * 1.18
    }
}))

// pizza prices including VAT Lidor version...
console.log(pizzas.map(pizza => {
    pizza.includingVAT = pizza.price * 1.18
    return pizza
}))

// highest pizza price
console.log(pizzas.reduce((max, pizza) => pizza.price > max ? pizza.price : max, 0))
