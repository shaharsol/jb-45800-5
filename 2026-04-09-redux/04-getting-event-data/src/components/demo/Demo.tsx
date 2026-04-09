import { useEffect, useState } from 'react'
import './Demo.css'

// these functions emulate data that originates from OUTSIDE of the component
// form a database, a remote server, a file, whatever
// these functions are not part of the component
function getDogs(): string[] {
    return ['Kate', 'Dubi', 'Betty']
}


export default function Demo() {
    const [animals, setAnimals] = useState<string[]>([])

    function displaySelection(event: React.ChangeEvent<HTMLSelectElement>) {
        
        alert(`select changed to ${event.currentTarget.value}`)
    }

    useEffect(() => {
        (async() => {
            setAnimals(getDogs())
        })()
    }, [])

    return (
        <div className="Demo">
            <select onChange={displaySelection}>
                {animals.map(animal => <option key={animal} value={animal}>{animal}</option>)}
            </select>
        </div>
    )
}