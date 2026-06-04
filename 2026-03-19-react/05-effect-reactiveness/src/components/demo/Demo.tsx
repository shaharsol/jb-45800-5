import { useEffect, useState } from 'react'
import './Demo.css'

// these functions emulate data that originates from OUTSIDE of the component
// form a database, a remote server, a file, whatever
// these functions are not part of the component
function getDogs(): string[] {
    return ['Kate', 'Dubi', 'Betty']
}

function getCats(): string[] {
    return ['Meow', 'Mitzi', 'Sophie']
}


export default function Demo() {
    const [animals, setAnimals] = useState<string[]>([])
    const [isDogs, setIsDogs] = useState<boolean>(true)

    function toggle() {
        setIsDogs(!isDogs)
    }

    useEffect(() => {
        setAnimals(isDogs ? getDogs() : getCats())
    }, [isDogs])

    return (
        <div className="Demo">
            <select onChange={toggle}>
                <option value="dogs">Dogs</option>
                <option value="cats">Cats</option>
            </select>
            <ul>
                {animals.map(animal => <li key={animal}>{animal}</li>)}
            </ul>
        </div>
    )
}