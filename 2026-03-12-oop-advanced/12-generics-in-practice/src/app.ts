(async() => {

    interface User {
        id: number,
        firstName: string,
        lastName: string
    }

    interface DummyJsonUsersResponse {
        users: User[]
    }

    const json = await fetch('https://dummyjson.com/users').then<DummyJsonUsersResponse>(response => response.json())
    // const json = await response.json() as { users: User[] }
    // const json = await response.json<DummyJsonUsersResponse>()    

    console.log(json.users[0].firstName)




})()