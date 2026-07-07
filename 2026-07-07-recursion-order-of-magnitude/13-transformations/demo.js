const getDataFromServer = url => { 
    return fetch(url).then(response => response.json())
}

(async () => {
    const { todos } = await getDataFromServer('https://dummyjson.com/todos')

    // display a list of users and their todos count
    // 163, 3
    // 127, 4

    console.log(todos)
})()