import type City from "../models/City"
import axios from 'axios'
class CityService {
    async getAll(): Promise<City[]> {
        const { data } = await axios('https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e')
        return data.result.records
    }
}

const cityService = new CityService()
export default cityService