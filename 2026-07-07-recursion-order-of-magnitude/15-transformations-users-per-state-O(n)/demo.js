// with the user list from https://dummyjson.com/users
// create a list of states, and number of users from each state
// OH, 2
// NY, 5
// MI, 7

const getData = url => {
    return fetch(url).then(response => response.json())
}

(async () => {
    const { users } = await getData('https://dummyjson.com/users')

    // assume users number is n
    // assume card types number is m


    const result = users.reduce((cumulative, { bank: { cardType }}) => {
        const cumulativeClone = {...cumulative}
        // const cardTypeItem = cumulativeClone.find(item => item.cardType === cardType)
        // if(cardTypeItem) cardTypeItem.count++
        // else cumulativeClone.push({ cardType, count: 1})
        cumulativeClone[cardType] = cumulativeClone[cardType] ? cumulativeClone[cardType] + 1 : 1
        return cumulativeClone
    }, {})

    let array = []
    for (const item in result) {
        array.push...
    }

    // this is a loop with n*m iterations
    // lets assume 10 users, 3 card types, 30 iterations
    // lets assume 100 users, 30 card types, 3000 iterations
    // lets assume 1M users, 100 card types, 100M iterations


    console.log(result)

    /*
    {
        amex: 5,
        visa: 3,
        mastercard: 17
    }
    */


    /*
    [
        {
            cardType: 'Amex',
            count: 5
        },
        {
            cardType: 'Visa',
            count: 3
        },
        {
            cardType: 'Mastercard',
            count: 17
        }

    ]
    */

    // console.log(users)
})()