import axios from "axios"
import type Jwt from "../models/Jwt"
import type Login from "../models/Login"

class AuthService {

    async login(login: Login): Promise<Jwt> {
        const { data } = await axios.post<Jwt>(`${import.meta.env.VITE_REST_SERVER_URL}/auth/login`, login) 
        return data
    }

}

const authService  = new AuthService()
export default authService