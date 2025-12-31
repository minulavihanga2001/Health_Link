import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from './config';

// Create a centralized axios instance
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // CRITICAL: Bypass Microsoft Dev Tunnel Warning Page
        'X-Tunnel-Skip-AntiPhishing-Page': 'true',
    },
    timeout: 30000,
});

// Request Interceptor: Attach Token Automatically
client.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('healthlink_jwt');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error attaching token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
