const getData = url => {
    return fetch(url).then(response => response.json())
}

(async () => {
    const { products } = await getData('https://dummyjson.com/products')


    products.reduce(...)
})()