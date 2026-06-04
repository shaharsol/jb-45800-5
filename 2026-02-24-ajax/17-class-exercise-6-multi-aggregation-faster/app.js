
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

        const reduction = 
            users.reduce((cumulative, { height, gender }) => {
                cumulative[gender].sum += height
                cumulative[gender].count += 1
                return cumulative
            }, {
                male: {
                    sum: 0,
                    count: 0
                },
                female: {
                    sum: 0,
                    count: 0
                }
            })

        // console.log(reduction)
        document.getElementById('averageMaleHeight').innerHTML = reduction.male.sum / reduction.male.count
        document.getElementById('averageFemaleHeight').innerHTML = reduction.female.sum / reduction.female.count

    } catch (e) {
        console.log(e)
    }
}