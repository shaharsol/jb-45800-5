import { useEffect, useState } from 'react'
import './Search.css'
import type City from '../../models/City'
import cityService from '../../services/city'
import weatherService from '../../services/weather'
import type Weather from '../../models/Weather'

export default function Search() {

    const [cities, setCities] = useState<City[]>([])
    const [currentCity, setCurrentCity] = useState<string>('')
    const [weather, setWeather] = useState<Weather>()

    useEffect(() => {
        (async () => {
            try {
                const cities = await cityService.getAll()
                setCities(cities.filter(({PIBA_bureau_name, city_name_he}) => PIBA_bureau_name === city_name_he))
            } catch (e) {
                alert(e)
            }
        })()
    }, [])

    useEffect(() => {
        (async() => {
            try {
                const weather = await weatherService.getPerCity(currentCity)
                setWeather(weather)

            } catch (e) {
                alert(e)
            }
        })()
    }, [currentCity])

    function citySelected(event: React.ChangeEvent<HTMLSelectElement>) {
        setCurrentCity(event.currentTarget.value)
    }

    return (
        <div className='Search'>
            <div>
                <select onChange={citySelected}>
                    {cities.map(({city_name_en, city_name_he}) => <option key={city_name_en} value={city_name_en}>{city_name_he}</option>)}
                </select>
            </div>
            <div>
                <table>
                    <tr>
                        <td>country</td>
                        <td>{weather?.location.country}</td>
                    </tr>
                    <tr>
                        <td>city</td>
                        <td>{weather?.location.name}</td>
                    </tr>
                    <tr>
                        <td>temp</td>
                        <td>{weather?.current.temp_c}</td>
                    </tr>
                    <tr>
                        <td>status</td>
                        <td><img src={weather?.current.condition.icon} /></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}