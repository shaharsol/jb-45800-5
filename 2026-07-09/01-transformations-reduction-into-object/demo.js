const getData = url => {
    return fetch(url).then(response => response.json())
}

(async () => {
    const { users } = await getData('https://dummyjson.com/users')

    const result = Object.entries(users.reduce((cumulative, { bank: { cardType }}) => {
        const cumulativeClone = {...cumulative}
        cumulativeClone[cardType] = cumulativeClone[cardType] ? cumulativeClone[cardType] + 1 : 1
        return cumulativeClone
    }, {})).map(([cardType, count]) => ({cardType, count}))

    console.log(result)

    // console.log(Object.entries(result))
    // console.log(Object.keys(result))
    // console.log(Object.values(result))
    
    // console.log(result)


})()