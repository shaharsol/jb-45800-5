
const getData = async url => fetch(url).then(response => response.json())

const loadList = async () => {
    try {
        const { users } = await getData('https://dummyjson.com/users')

        document.getElementById('list').innerHTML = users
            .map(({firstName, lastName, age, email}) => `<tr>
                <td>${firstName} ${lastName}</td>
                <td>${age}</td>
                <td>${email}</td>
            </tr>`)
            .join('')

        document.getElementById('averageHeight').innerHTML = 
            users.reduce((sumHeight, { height }) => sumHeight + height, 0) / users.length

    } catch (e) {
        console.log(e)
    }
}