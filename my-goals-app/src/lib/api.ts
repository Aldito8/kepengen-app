import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_SERVER,
    withCredentials: true,
});

export async function fetchCookie(url: string, token?: string) {
    try {
        const res = await api.get(url, {
            headers: token ? { Cookie: `token=${token}` } : undefined,
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching backend data:', err);
        throw err;
    }
}