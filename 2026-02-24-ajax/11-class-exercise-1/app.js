const loadList = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users')
        const { users } = await response.json()

        const html = users
            .map(({firstName, lastName}) => `<li>${firstName} ${lastName}</li>`)
            .reduce((html, user) => html += user, '')

        // console.log(html)
        document.getElementById('list').innerHTML = html

    } catch (e) {
        console.log(e)
    }
}