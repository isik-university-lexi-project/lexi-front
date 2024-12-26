import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create();


axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken'); // or sessionStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);



axiosInstance.interceptors.response.use(
    response => {
        if (response.status === 401 || response.status === 403) {
            const navigate = useNavigate();
            navigate('/login');
        }
        return response;
    },
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const navigate = useNavigate();
            navigate('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;