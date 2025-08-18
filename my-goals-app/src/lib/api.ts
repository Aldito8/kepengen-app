import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
});

export const apiServer = axios.create({
    baseURL: process.env.API_URL_SERVER || process.env.NEXT_PUBLIC_API_URL_SERVER,
    withCredentials: true,
});