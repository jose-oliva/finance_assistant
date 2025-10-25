import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosInstance = axios.create({
    baseURL: "https://dream-lab-backend.azurewebsites.net/v1/",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGI3MDIxZmM2Y2RhY2EyMjA1Yjg1YyIsIm5hbWUiOiJEQVZJRCBGQVVET0EiLCJlbWFpbCI6IkEwMDgzNDgwMSIsImNhcmVlciI6IklUQyIsInNlbWVzdGVyIjo2LCJyb2xlIjoiU1VQRVJBRE1JTiIsImV4cCI6MTcyNTQ3NDEwMn0.vjprGmHb5MX_AUBD1bZ33HQJjVJ_US0cjb5GzsKcnpA'
    }
});

axiosRetry(axiosInstance, {
    retries: 3, // Number of retry attempts
    retryDelay: (retryCount) => {
        return retryCount * 1000; // Time between retries in milliseconds
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        return error.response?.status >= 500 || error.code === 'ECONNABORTED';
    }
});

export default axiosInstance;
