const getData = url => {
    return fetch(url).then(response => response.json())
}

(async () => {
    const { products } = await getData('https://dummyjson.com/products')

    const result = products
        .filter(({stock}) => stock >= 50)
        .reduce((cumulative, { dimensions: {depth}}) => {
            const cumulativeClone = {...cumulative}
            if(depth > 20) cumulativeClone.deep++ 
            else cumulativeClone.shallow++
            return cumulativeClone
        }, {deep: 0, shallow: 0})
    
        console.log(result)

})()