import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

axiosInstance.interceptors.request.use(
    config => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const token = JSON.parse(userInfo).token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                // JSON parse error — просто игнорируем
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export default axiosInstance;
