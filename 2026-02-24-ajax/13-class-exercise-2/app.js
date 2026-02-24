const loadList = async () => {
    try {
        const response = (await fetch('https://dummyjson.com/users'))
        const { users } = await response.json()

        document.getElementById('list').innerHTML = users
            .map(({firstName, lastName, age, email}) => `<tr>
                <td>${firstName} ${lastName}</td>
                <td>${age}</td>
                <td>${email}</td>
            </tr>`)
            .join('')

    } catch (e) {
        console.log(e)
    }
}