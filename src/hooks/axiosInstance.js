import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosInstance = axios.create({
    baseURL: "https://omnia-backend.azurewebsites.net/v1/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer API_KEY'
    }
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    },
    retryCondition: (error) => {
        return error.response?.status >= 500 || error.code === 'ECONNABORTED';
    }
});

export default axiosInstance;
