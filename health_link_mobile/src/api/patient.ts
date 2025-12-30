import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './auth';

export interface PatientProfileDTO {
    nic: string;
    mobileNumber: string;
    dob: string; // ISO date string YYYY-MM-DD
    gender: string;
    address: string;
    allergies: string[];
    maritalStatus: string;
    guardianName: string;
    guardianContact: string;
    profileImage?: string; // Base64 string
    bloodGroup?: string;
    height?: number;
    weight?: number;
}

// Helper to get token
const getToken = async () => {
    return await SecureStore.getItemAsync('healthlink_jwt');
};

const getHeaders = async () => {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getProfile = async (): Promise<any> => {
    try {
        const headers = await getHeaders();
        // Since we don't have the user ID easily accessible here for the URL param in /patient/{id}/records,
        // we'll rely on the new /profile endpoint which uses the token.
        // Wait, did I create /profile in PatientDataController? Yes.
        // It resides at /api/v1/patient/profile
        const response = await axios.get(`${API_URL}/patient/profile`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (data: PatientProfileDTO): Promise<any> => {
    try {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/patient/complete-profile`, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};
