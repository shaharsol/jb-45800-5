const x = 1;

const myFunc = () => {
    const fname = 'shuli'
    const lname = 'gilardi'
    return fname + ' ' + lname
}

const yossi = {
    id: 1,
    name: 'yossi',
    isAdmin: true
}

const niko = {
    id: 2,
    name: 'niko',
    isAdmin: false
}

const miguel = {
    id: 3,
    name: 'miguel',
    isAdmin: false
}

const users = [yossi, niko, miguel]

let admins = 0;
let nonAdmins = 0;
const fullname = myFunc()
for(let i=0; i <= users.length; i++) {
    if(users[i]!.isAdmin) admins++
    else nonAdmins++
}

console.log(`admins: ${admins}. non admins: ${nonAdmins}`)