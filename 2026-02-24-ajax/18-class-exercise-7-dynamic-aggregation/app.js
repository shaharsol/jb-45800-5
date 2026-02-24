
const getData = async url => fetch(url).then(response => response.json())

const loadList = async () => {
    try {
        const { users } = await getData('https://dummyjson.com/users')

        const reduction = 
            users.reduce((cumulative, { address: { state } }) => {
                const stateStats = cumulative.find(stats => stats.state === state)
                if(stateStats) {
                    stateStats.count += 1
                } else {
                    cumulative.push({
                        state,
                        count: 1
                    })
                }
                return cumulative
            }, [])

        // expecting to get:
        /*
        [
            {
                state: 'Mississipi',
                count: 8
            },
            {
                state: 'Alabama',
                count: 2
            },
            {
                state: 'New Mexico',
                count: 5
            },
        ]
        */


        document.getElementById('list').innerHTML = reduction
            .map(({state, count}) => `<tr>
                <td>${state}</td>
                <td>${count}</td>
            </tr>`)
            .join('')


    } catch (e) {
        console.log(e)
    }
}