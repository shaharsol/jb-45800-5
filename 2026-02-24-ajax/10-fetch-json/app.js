const loadList = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users')
        const result = await response.json()
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}