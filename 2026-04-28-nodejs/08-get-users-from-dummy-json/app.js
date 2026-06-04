const response = await fetch('https://dummyjson.com/users')
const { users } = await response.json()
console.log(users.map(({firstName, lastName}) => `${firstName} ${lastName}`).join('\n'))
