import { useState } from 'react'
import './Demo.css'

export default function Demo() {

    const startTime = (new Date()).toLocaleTimeString()
    //                                             the type of the state
    //                                                     the initial value of the state 
    const [currentTime, setCurrentTime] = useState<string>((new Date()).toLocaleTimeString())

    setInterval(() => {
        console.log('inside setInterval callback...')
        setCurrentTime((new Date()).toLocaleTimeString())
    }, 1* 1000)

    return (
        <div className="Demo">
            <h1>{startTime}</h1>
            <h1>{currentTime}</h1>
        </div>
    )
}