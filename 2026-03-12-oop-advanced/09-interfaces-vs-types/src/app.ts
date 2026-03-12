type User = {
    id: number
    name: string
    age: number
    friends: string[]
}

interface AlsoUser {
    id: number
    name: string
    age: number
    friends: string[]
}

const user: User = {
    id: 1,
    name: 'moshe',
    age: 22,
    friends: ['shlomit', 'yafit']
}

const alsoUser: AlsoUser = {
    id: 1,
    name: 'moshe',
    age: 22,
    friends: ['shlomit', 'yafit']
}

user.fghdfghdfg = 3
alsoUser.fjkdfjkgdrjk = 3

interface ExtendedUser extends AlsoUser {
    address: string
}

// all in all it was realized that interfaces tend to be much
// more useful then types

// conclusion:
// for our daily TS programming needs, we should prefer to use
// interfaces over types