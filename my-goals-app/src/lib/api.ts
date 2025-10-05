import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_SERVER,
    withCredentials: true,
});

export const apiSSR = (cookie?: string) => {
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL_SERVER,
        withCredentials: true,
        headers: {
            Cookie: cookie || "",
        },
    });
};