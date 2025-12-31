import client from './client';

// Define the shape of the result, matching backend DTO
export interface ScanResultDTO {
    nic: string | null;
    mobileNumber: string | null;
    dob: string | null;
    gender: string | null;
    address: string | null;
    allergies: string[] | null;
    maritalStatus: string | null;
    guardianName: string | null;
    guardianContact: string | null;
    profileImage: string | null;
    bloodGroup: string | null;
    height: number | null;
    weight: number | null;
}

export const getPatientByHealthId = async (healthId: string): Promise<ScanResultDTO> => {
    // client handles auth and base url
    const response = await client.get(`/doctor/patient/${healthId}`);
    return response.data;
};
