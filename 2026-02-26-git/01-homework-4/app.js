const getData = async url => fetch(url).then(response => response.json())

const showSelectedUserDetails = async () => {
    const selectedUserId = document.getElementById('usersSelect').value

    const { email, phone, address: { city }} = await getData(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`)

    document.getElementById('email').innerHTML = email
    document.getElementById('phone').innerHTML = phone
    document.getElementById('city').innerHTML = city

}

(async () => {

    const users = await getData('https://jsonplaceholder.typicode.com/users')

    document.getElementById('usersSelect').innerHTML = users
        .map(({id, name}) => `<option value="${id}">${name}</option>`)
        .join('')


})()



