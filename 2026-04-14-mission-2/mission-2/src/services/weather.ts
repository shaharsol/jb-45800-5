import type Weather from "../models/Weather"
import axios from 'axios'

class WeatherService {
    async getPerCity(city: string): Promise<Weather> {
        const { data} = await axios<Weather>(`https://api.weatherapi.com/v1/current.json?key=3dcceb66eddc460fb34121402260904&q=${city}`)
        return data
    }
}

const weatherService = new WeatherService()
export default weatherService