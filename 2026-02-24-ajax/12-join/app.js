const loadList = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users')
        const { users } = await response.json()

        const html = users
            .map(({firstName, lastName}) => `<li>${firstName} ${lastName}</li>`)
            // if we need a reduce function to concatenate all array items
            // into a single string, we can use "join" instead of reduce
            // .reduce((html, user) => html += user, '')
            .join('')

        // console.log(html)
        document.getElementById('list').innerHTML = html

    } catch (e) {
        console.log(e)
    }
}