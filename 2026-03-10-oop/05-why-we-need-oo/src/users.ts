export const users = [
    {}, {}, {}, {}, {}
]
export function getCount() {
    return users.length
}

export default function howManyUsers() {
    console.log(getCount())
}

document.getElementById('howManyUsersButton')!.addEventListener('click', () => {
    howManyUsers()
})

// in this case i could write a shorther version, but thats not the point...
// document.getElementById('howManyUsersButton')!.addEventListener('click', howManyUsers)




