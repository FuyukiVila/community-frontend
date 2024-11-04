import axios from 'axios'
const createService = (baseUrl) => {
    return axios.create({
        baseURL: baseUrl,
        timeout: 5 * 1000
    });
};

const service = createService("https://v1.jinrishici.com");
export function getTip() {
    return service({
        url: "all.json",
        method: "GET"
    })
}