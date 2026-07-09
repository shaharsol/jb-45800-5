const getData = url => {
    return fetch(url).then(response => response.json())
}

(async () => {
    const { products } = await getData('https://dummyjson.com/products')

    const result = Object.entries(products.reduce((cumulative, {category, reviews}) => {
        const cumulativeClone = {...cumulative}
        const sumReviews = reviews.reduce((cumulative, { rating }) => cumulative + rating, 0)
        const avgPerProduct = sumReviews/reviews.length
        if(!cumulativeClone[category]) cumulativeClone[category] = {sum: avg, count: 1}
        else {
            cumulativeClone[category].sum += avg
            cumulativeClone[category].count++
        }
        return cumulativeClone
    }, {})).map(([category, {sum , count}]) => ({category, avg: sum / count}))

    console.log(result)

})()