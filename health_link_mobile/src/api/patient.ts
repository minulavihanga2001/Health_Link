import client from './client';

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

export const getProfile = async (): Promise<any> => {
    try {
        const response = await client.get('/patient/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (data: PatientProfileDTO): Promise<any> => {
    try {
        const response = await client.post('/patient/complete-profile', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
