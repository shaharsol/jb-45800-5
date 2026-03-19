import { useEffect, useState } from 'react'
import './Demo.css'

export default function Demo() {

    // const startTime = (new Date()).toLocaleTimeString()
    // const startTime = useRef<string>((new Date()).toLocaleTimeString())
    //                                             the type of the state
    //                                                     the initial value of the state 
    const [currentTime, setCurrentTime] = useState<string>((new Date()).toLocaleTimeString())

    // useEffect is used to control when a code will run inside a component
    // components code is run in two cases:
    // - in initial rendering
    // - and in re-rendering
    // it is very dangerous to include "naked" code inside a component
    // function, since we must take into consideration that it will run
    // with every re-render
    // therefore, react provides us the useEffect hook to control
    // when a code will run.
    // we determine when a code runs, using the 2nd param (the 1st param is the code itself, inside a callback):
    // - if we omit the 2nd param and pass only a callbck the code will run with every render
    // - if we pass an empty array as the 2nd param, it means we want the code to run only on initial rendering
    // - if we pass anything (X) inside the array, it means we want the code to run whenever the X changes. this means the effect becomes reactive to X
    useEffect(() => {
        // constructing the effect
        const intervalId = setInterval(() => {
            console.log('inside setInterval callback...')
            setCurrentTime((new Date()).toLocaleTimeString())
        }, 1* 1000)

        // deconstruct the effect - or cleaning up
        // the useEffect eay of cleaning up is returning a callback,
        // this callback will run once the effect is no longer needed
        // and react will not mark our components as pure as long
        // as we have effects that don't clean up after them
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div className="Demo">
            {/* <h1>start time: {startTime.current}</h1> */}
            <h1>current time: {currentTime}</h1>
        </div>
    )
}