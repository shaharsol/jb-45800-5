const getDataFromServer = url => { 
    return fetch(url).then(response => response.json())
}

(async () => {
    const { todos } = await getDataFromServer('https://dummyjson.com/todos')

    // display a list of users and their todos count
    // 163, 3
    // 127, 4

    // console.log(todos)

    const result = todos.reduce((cumulative, {userId}) => {
        const clonedCumulative = [...cumulative]
        const item = clonedCumulative.find(item => item.userId === userId)
        if(item) item.count++
        else clonedCumulative.push({userId, count: 1})
        return clonedCumulative
    }, [])

    console.log(result)
    /*
    [
        {
            userId: ...,
            count: ...,            
        },
        {
            userId: ...,
            count: ...,            
        },
    ]

    [
        [162, 3],
        [165, 4]
    ]
    */

})()