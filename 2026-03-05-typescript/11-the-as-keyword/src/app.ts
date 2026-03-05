// const myDiv = document.getElementById('myDiv')
// type narrowing
// if(myDiv) {
//     myDiv.innerHTML = 'fdgjkdfjgkdfjgkdf'
// }

const myDiv = document.getElementById('myDiv') as HTMLElement
myDiv.innerHTML = 'fdgjkdfjgkdfjgkdf'

function displayName() {
    // this is the long way to do it, using an if statement
    // const firstNameInput = document.getElementById('firstName') as HTMLElement
    // if('value' in firstNameInput) {
    //     const firstName = firstNameInput.value
    //     console.log(firstName)
    // }

    // using the most specific "as" saves me from "if" and from Type Narrowing
    // makes the code more streamlined, yet a little less secure
    const firstNameInput = document.getElementById('firstName') as HTMLInputElement
    const firstName = firstNameInput.value
    console.log(firstName)

}


// as can be easily abused
let someNumber = "33" as unknown as number
console.log(someNumber.toFixed(2));

type Todo = {
    id: number,
    todo: string,
    completed: boolean,
    userId: number
}

type DummyJSONTodosResponse = {
    todos: Todo[]
}

(async () => {
    const response = await fetch('https://dummyjson.com/todos')
    // below is an example of using an anonymous type
    // const json = await response.json() as { todos: Todo[] }
    const json = await response.json() as DummyJSONTodosResponse
    console.log(json.todos[0].id)

})


