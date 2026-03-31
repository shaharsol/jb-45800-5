import { useContext } from "react";
import AuthContext from "../components/auth/auth/AuthContext";
import axios, { type AxiosInstance } from "axios";
import type AuthAwareService from "../services/auth-aware/AuthAware";

export default function useService<T extends AuthAwareService>(Service: {new(axiosInstance: AxiosInstance): T}): T {
    const { jwt } = useContext(AuthContext)!

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })

    return new Service(axiosInstance)
}