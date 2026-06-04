import './Demo.css'

export default function Demo() {

    const name = 'Kirril'
    const age = 32
    const isMale: boolean = true

    const grades = [92, 96, 100]

    function getIsMale(isMale: boolean): string {
        return isMale? 'yes is male' : 'no, is not male'
    }

    function sayHello() {
        alert('hello')
    }

    return (
        <div className="Demo">
        {/* <> */}
            {/* using the {} chars to embed TS/JS values inside the markup is called embedding */}
            <h1>hello {name}</h1>
            <h2>you are {age} years old</h2>
            <h2>are you male? {isMale ? 'yes' : 'no'}</h2>
            {/* to embed arrays we will always use map, and react will join for us automatically */}
            <h2>your grades are <ul>{grades.map(grade => <li>{grade}</li>)}</ul></h2>

            <h2>are you male? {getIsMale(isMale)}</h2>

            {/* event handling using react's "on" handlers, give a function in the embed, 
            but not a function invocation! just a function declaration */}
            <button onClick={sayHello}>say hello</button>

            {/* condintional rendering */}
            
            {/* this is left for next class */}
        {/* </> */}
        </div>
    )
}