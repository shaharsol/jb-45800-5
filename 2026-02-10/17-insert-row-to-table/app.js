const moshe = {
	id: 12,
	name: 'Moshe',
	country: 'israel',
    profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Moshe_Solomon_%28R_H_3621%29.jpg/960px-Moshe_Solomon_%28R_H_3621%29.jpg'
}


function addRowToTable() {
    const friendsTable = document.getElementById('friends')

    const row = `<tr>
        <td>${moshe.id}</td>
        <td>${moshe.name}</td>
        <td>${moshe.country}</td>
        <td><img src="${moshe.profilePic}" /></td>
    </tr>`  
    
    friendsTable.innerHTML = friendsTable.innerHTML + row
}

function addRowToTableForIn() {
    const friendsTable = document.getElementById('friends')

    let row = '<tr>';

    for (const prop in moshe) {
        row = row + `<td>${moshe[prop]}</td>`
    }

    row = row + '</tr>'
    
    friendsTable.innerHTML = friendsTable.innerHTML + row
}