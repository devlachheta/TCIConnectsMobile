import axios from "axios";

const api = axios.create({
    baseURL: "https://tcidentallab.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;