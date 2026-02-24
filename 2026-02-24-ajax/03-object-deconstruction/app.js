const pizza = {
    diameter: 80,
    price: 20,
    toppings: 3,
    slices: 8
}


// print pizza price
console.log(pizza.price)

// lets say that the only info i need from the pizza object
// going forward is the price.
// if i write "pizza.price" every time, i will get a long code...
// this is where deconstruction comes to play

const { price } = pizza
console.log(price)

const { toppings, slices } = pizza
console.log(pizza.toppings, pizza.slices)
console.log(toppings, slices)


// instead of these two long lines:
const diameter = pizza.diameter
const slices = pizza.slices

// write this single short line...
const { diameter, slices } = pizza
