
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

        const men = users.filter(({gender}) => gender === 'male')
        document.getElementById('averageMaleHeight').innerHTML = 
            men.reduce((sumHeight, { height }) => sumHeight + height, 0) / men.length

        const women =   .filter(({gender}) => gender === 'female')
        document.getElementById('averageFemaleHeight').innerHTML = 
            women.reduce((sumHeight, { height }) => sumHeight + height, 0) / women.length

    } catch (e) {
        console.log(e)
    }
}