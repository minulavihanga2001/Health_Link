import client from './client';
import { PatientProfileDTO } from './patient';

export const getPatientByHealthId = async (healthId: string): Promise<PatientProfileDTO> => {
    const response = await client.get(`/doctor/patient/${healthId}`);
    return response.data;
};
