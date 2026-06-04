// what do i need to include in a code that describes a user in the system?
// name
// age
// friendsCount
// addFriend
// removeFriend
const username = 'yossi'
const age = 22
const friends = []
const friendsCount = friends.length
function addFriend(toUser: number, fromUser: number) {

} 

function removeFriend(toUser: number, fromUser: number) {
    
} 

// what happens with the next user?
const username2 = 'shlomo'
const age2 = 44
const friends2 = []
const friendsCount2 = friends2.length
function addFriend2(toUser: number, fromUser: number) {

} 

function removeFriend2(toUser: number, fromUser: number) {
    
} 

// the next better solution is to use objects
const user1 = {
    name: 'yossi',
    age: 22,
    friends: [],
    addFriend: () => {},
    removeFriend: () => {}
}

// using objects is a much more elegant solution, 
// yet it doesnt ensures consistency

const user2 = {
    name: 'shlomo',
    birthdate: '1980-01-01',
    followers: [],
    follow: () => {},
    unfollow: () => {}
}

// a step forward would be to use TypeScript
type User = {
    name: string,
    age: number,
    friends: string[],
    follow: Function,
    unfollow: Function
}

// this is the best i can do WITHOUT OO
