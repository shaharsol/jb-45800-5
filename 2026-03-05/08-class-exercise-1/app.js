users = [
    {
        id: '22',
        name: 'Moshe',
        following: ['24']
    }, {
        id: '23',
        name: 'Eilat',
        following: []
    }, {
        id: '24',
        name: 'Golan',
        following: ['22', '23']
    }
]

id = prompt('enter user id')

for(user of users) {
    // this means i found the user in my database
    if(user.id == id) {
        for(followingId of user.following) {
            console.log(followingId)
        }
    }
}

